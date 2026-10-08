"use server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/auth/require-admin";
import { FieldValue } from "firebase-admin/firestore";
export type ListingReport = {
  id: string;
  listingId: string;
  reason: string;
  status: string;
  createdAt: string;
};
export async function getListingReports(
  input: unknown,
): Promise<ListingReport[]> {
  const { idToken } = z.object({ idToken: z.string().min(1) }).parse(input);
  await requireAdmin(idToken);
  const rows = await adminDb
    .collection("listingReports")
    .orderBy("createdAt", "desc")
    .limit(100)
    .get();
  return rows.docs.map((doc) => {
    const d = doc.data();
    return {
      id: doc.id,
      listingId: d.listingId,
      reason: d.reason,
      status: d.status,
      createdAt: d.createdAt?.toDate().toISOString() ?? "",
    };
  });
}
export async function closeListingReport(input: unknown) {
  const { idToken } = z.object({ idToken: z.string().min(1) }).parse(input);
  const adminUid = await requireAdmin(idToken);
  const { reportId } = z
    .object({ reportId: z.string().regex(/^[\w-]{1,150}$/) })
    .parse(input);
  await adminDb
    .collection("listingReports")
    .doc(reportId)
    .update({
      status: "CLOSED",
      reviewedBy: adminUid,
      reviewedAt: FieldValue.serverTimestamp(),
    });
  return { success: true };
}
