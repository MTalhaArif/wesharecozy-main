import { describe, it, expect, vi, beforeEach } from "vitest";
const mocks = vi.hoisted(() => ({
  verify: vi.fn(),
  get: vi.fn(),
  transaction: vi.fn(),
  limit: vi.fn(),
}));
vi.mock("@/lib/firebase-admin", () => ({
  adminAuth: { verifyIdToken: mocks.verify },
  adminDb: {
    collection: () => ({ doc: () => ({ get: mocks.get }) }),
    runTransaction: mocks.transaction,
  },
}));
vi.mock("@/lib/runtime", () => ({ requireLiveMode: () => {} }));
vi.mock("@/lib/rate-limit", () => ({ consumeLimit: mocks.limit }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
import { getThreadMessages, sendThreadMessage } from "@/actions/inbox/threads";
import { changeListingStatus } from "@/actions/listings/manage-listing";
beforeEach(() => {
  vi.clearAllMocks();
  mocks.verify.mockResolvedValue({
    uid: "outsider",
    firebase: { sign_in_provider: "password" },
  });
  mocks.get.mockResolvedValue({ data: () => ({ members: ["guest", "host"] }) });
});
describe("private conversation authorization", () => {
  it("rejects an invalid token before touching conversation storage", async () => {
    mocks.verify.mockRejectedValue(new Error("invalid token"));
    await expect(
      getThreadMessages({ idToken: "bad", threadId: "thread-1" }),
    ).rejects.toThrow("invalid token");
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it("denies a non-participant reading messages", async () => {
    await expect(
      getThreadMessages({ idToken: "valid", threadId: "thread-1" }),
    ).rejects.toThrow("Conversation not found");
  });
  it("denies a non-participant sending and does not consume a quota or write", async () => {
    await expect(
      sendThreadMessage({
        idToken: "valid",
        threadId: "thread-1",
        text: "hello",
        messageId: "d7764d50-57ba-4cf4-b0c6-6b973b337d11",
      }),
    ).rejects.toThrow("Conversation not found");
    expect(mocks.limit).not.toHaveBeenCalled();
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it("rejects anonymous accounts", async () => {
    mocks.verify.mockResolvedValue({
      uid: "anon",
      firebase: { sign_in_provider: "anonymous" },
    });
    await expect(
      getThreadMessages({ idToken: "valid", threadId: "thread-1" }),
    ).rejects.toThrow("Please sign in");
  });
});
describe("host lifecycle authorization", () => {
  it("does not let another host change a listing status", async () => {
    const update = vi.fn();
    mocks.transaction.mockImplementation(async (fn) =>
      fn({
        get: async () => ({
          data: () => ({ ownerUid: "real-host", status: "PUBLISHED" }),
        }),
        update,
      }),
    );
    await expect(
      changeListingStatus({
        idToken: "valid",
        listingId: "listing-1",
        action: "pause",
      }),
    ).rejects.toThrow("Listing not found");
    expect(update).not.toHaveBeenCalled();
  });
  it("does not let the owner republish a removed listing", async () => {
    const update = vi.fn();
    mocks.transaction.mockImplementation(async (fn) =>
      fn({
        get: async () => ({
          data: () => ({ ownerUid: "outsider", status: "REMOVED" }),
        }),
        update,
      }),
    );
    await expect(
      changeListingStatus({
        idToken: "valid",
        listingId: "listing-1",
        action: "publish",
      }),
    ).rejects.toThrow("removed by an administrator");
    expect(update).not.toHaveBeenCalled();
  });
  it("allows the owner to pause a published listing", async () => {
    const update = vi.fn();
    mocks.transaction.mockImplementation(async (fn) =>
      fn({
        get: async () => ({
          data: () => ({ ownerUid: "outsider", status: "PUBLISHED" }),
        }),
        update,
      }),
    );
    await expect(
      changeListingStatus({
        idToken: "valid",
        listingId: "listing-1",
        action: "pause",
      }),
    ).resolves.toEqual({ success: true });
    expect(update).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ status: "DEACTIVATED" }),
    );
  });
});
