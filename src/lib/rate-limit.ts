import { adminDb } from "@/lib/firebase-admin";
// Atomic across serverless instances; the key contains a caller UID or hashed IP.
export async function consumeLimit(
  key: string,
  maximum: number,
  windowMs: number,
) {
  const ref = adminDb.collection("rateLimitCounters").doc(key);
  const now = Date.now();
  await adminDb.runTransaction(async (tx) => {
    const doc = await tx.get(ref);
    const times = (doc.data()?.times ?? []) as number[];
    const recent = times.filter((t) => t > now - windowMs);
    if (recent.length >= maximum)
      throw new Error("Too many requests. Please try again later.");
    tx.set(ref, { times: [...recent, now] });
  });
}
