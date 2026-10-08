"use server";
import { z } from "zod";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { requireLiveMode } from "@/lib/runtime";
import { consumeLimit } from "@/lib/rate-limit";
export async function reportListing(input: unknown) {
  requireLiveMode();
  const { idToken } = z.object({ idToken: z.string().min(1) }).parse(input);
  const user = await adminAuth.verifyIdToken(idToken);
  const { listingId, reason } = z
    .object({
      listingId: z.string().regex(/^[\w-]{1,150}$/),
      reason: z.string().trim().min(10).max(2000),
    })
    .parse(input);
  await consumeLimit(`report-${user.uid}`, 5, 3600000);
  const listing = await adminDb.collection("listings").doc(listingId).get();
  if (!listing.exists) throw new Error("Listing not found");
  await adminDb
    .collection("listingReports")
    .add({
      listingId,
      reporterUid: user.uid,
      reason,
      status: "OPEN",
      createdAt: FieldValue.serverTimestamp(),
    });
  return { success: true };
}
