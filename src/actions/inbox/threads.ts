"use server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireLiveMode } from "@/lib/runtime";
import { isListingExpired } from "@/lib/listings/is-expired";
import { consumeLimit } from "@/lib/rate-limit";
import { assertThreadMember } from "@/lib/inbox/permissions";
import type { ThreadSummary, ThreadMessage } from "@/lib/inbox/types";
const id = z.string().regex(/^[\w-]{1,150}$/);
const auth = z.object({ idToken: z.string().min(1) });
async function caller(input: unknown) {
  requireLiveMode();
  const { idToken } = auth.parse(input);
  const decoded = await adminAuth.verifyIdToken(idToken);
  if (decoded.firebase.sign_in_provider === "anonymous")
    throw new Error("Please sign in to your account.");
  return decoded;
}
export async function startThread(input: unknown) {
  const user = await caller(input);
  const { listingId } = auth.extend({ listingId: id }).parse(input);
  await consumeLimit(`inbox-start-${user.uid}`, 20, 3600000);
  const listing = await adminDb.collection("listings").doc(listingId).get();
  const l = listing.data();
  if (
    !l ||
    l.status !== "PUBLISHED" ||
    isListingExpired(l.publishedAt?.toDate() ?? null)
  )
    throw new Error("Listing is no longer available.");
  if (l.ownerUid === user.uid)
    throw new Error(
      "You own this listing. Open your inbox to reply to guests.",
    );
  const threadId = createHash("sha256")
    .update(`${listingId}:${user.uid}`)
    .digest("hex");
  const ref = adminDb.collection("threads").doc(threadId);
  const host = await adminDb.collection("users").doc(l.ownerUid).get();
  await adminDb.runTransaction(async (tx) => {
    const existing = await tx.get(ref);
    if (existing.exists) return;
    tx.set(ref, {
      listingId,
      members: [user.uid, l.ownerUid],
      names: {
        [user.uid]: user.name || "Guest",
        [l.ownerUid]: host.data()?.displayName || "Host",
      },
      titleEn: l.titleEn,
      titleTr: l.titleTr,
      photoUrl: l.photoUrls?.[0] ?? "",
      lastText: "",
      updatedAt: FieldValue.serverTimestamp(),
      createdAt: FieldValue.serverTimestamp(),
    });
  });
  return { threadId };
}
export async function getThreads(input: unknown): Promise<ThreadSummary[]> {
  const user = await caller(input);
  const docs = await adminDb
    .collection("threads")
    .where("members", "array-contains", user.uid)
    .orderBy("updatedAt", "desc")
    .limit(100)
    .get();
  return docs.docs.map((doc) => {
    const d = doc.data();
    const other = d.members.find((u: string) => u !== user.uid);
    return {
      id: doc.id,
      listingId: d.listingId,
      titleEn: d.titleEn,
      titleTr: d.titleTr,
      photoUrl: d.photoUrl,
      otherName: d.names?.[other] || "Member",
      lastText: d.lastText,
      updatedAt: d.updatedAt?.toMillis() ?? 0,
    };
  });
}
export async function getThreadMessages(
  input: unknown,
): Promise<{ messages: ThreadMessage[]; olderCursor: string | null }> {
  const user = await caller(input);
  const { threadId, before } = auth
    .extend({ threadId: id, before: id.optional() })
    .parse(input);
  const ref = adminDb.collection("threads").doc(threadId);
  const thread = await ref.get();
  assertThreadMember(thread.data()?.members, user.uid);
  let query = ref
    .collection("messages")
    .orderBy("createdAt", "desc")
    .orderBy("__name__", "desc");
  if (before) {
    const cursor = await ref.collection("messages").doc(before).get();
    if (cursor.exists) query = query.startAfter(cursor);
  }
  const docs = await query.limit(51).get();
  const page = docs.docs.slice(0, 50);
  const messages = page
    .map((doc) => {
      const d = doc.data();
      return {
        id: doc.id,
        senderUid: d.senderUid,
        text: d.text,
        createdAt: d.createdAt?.toMillis() ?? 0,
      };
    })
    .reverse();
  return { messages, olderCursor: docs.size > 50 ? page.at(-1)!.id : null };
}
export async function sendThreadMessage(input: unknown) {
  const user = await caller(input);
  const { threadId, text, messageId } = auth
    .extend({
      threadId: id,
      text: z.string().trim().min(1).max(3000),
      messageId: z.string().uuid(),
    })
    .parse(input);
  const ref = adminDb.collection("threads").doc(threadId);
  // Check membership before consuming a quota or exposing thread metadata.
  const thread = await ref.get();
  assertThreadMember(thread.data()?.members, user.uid);
  const messageRef = ref.collection("messages").doc(messageId);
  await consumeLimit(`inbox-send-${user.uid}`, 30, 60000);
  await adminDb.runTransaction(async (tx) => {
    const [current, existing] = await Promise.all([
      tx.get(ref),
      tx.get(messageRef),
    ]);
    assertThreadMember(current.data()?.members, user.uid);
    if (existing.exists) return;
    tx.set(messageRef, {
      senderUid: user.uid,
      text,
      createdAt: FieldValue.serverTimestamp(),
    });
    tx.update(ref, {
      lastText: text.slice(0, 180),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
  return { messageId };
}
