"use server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireLiveMode } from "@/lib/runtime";
import { assertListingOwner } from "@/lib/inbox/permissions";
import { listingEditSchema } from "@/lib/schemas/listing-edit-schema";
const base = z.object({
  idToken: z.string().min(1),
  listingId: z.string().regex(/^[\w-]{1,150}$/),
});
export async function changeListingStatus(input: unknown) {
  requireLiveMode();
  const { idToken } = base.pick({ idToken: true }).parse(input);
  const user = await adminAuth.verifyIdToken(idToken);
  const { listingId, action } = base
    .extend({ action: z.enum(["pause", "publish"]) })
    .parse(input);
  const ref = adminDb.collection("listings").doc(listingId);
  await adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    assertListingOwner(doc.data()?.ownerUid, user.uid, doc.data()?.status);
    tx.update(ref, {
      status: action === "pause" ? "DEACTIVATED" : "PUBLISHED",
      ...(action === "publish"
        ? { publishedAt: FieldValue.serverTimestamp() }
        : {}),
      updatedAt: FieldValue.serverTimestamp(),
    });
  });
  revalidatePath("/[locale]", "layout");
  return { success: true };
}
export async function editListing(input: unknown) {
  requireLiveMode();
  const { idToken } = base.pick({ idToken: true }).parse(input);
  const user = await adminAuth.verifyIdToken(idToken);
  const { listingId, values } = base
    .extend({ values: listingEditSchema })
    .parse(input);
  const ref = adminDb.collection("listings").doc(listingId);
  await adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    assertListingOwner(doc.data()?.ownerUid, user.uid, doc.data()?.status);
    tx.update(ref, { ...values, updatedAt: FieldValue.serverTimestamp() });
  });
  revalidatePath("/[locale]", "layout");
  return { success: true };
}
