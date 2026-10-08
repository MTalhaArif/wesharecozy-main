import { adminDb } from "@/lib/firebase-admin";
import { isDemoMode } from "@/lib/runtime";
import { ISTANBUL_DISTRICTS } from "./district-data";
import type { DistrictSeed } from "./district-data";

export async function getDistricts(): Promise<DistrictSeed[]> {
  if (isDemoMode) return ISTANBUL_DISTRICTS;
  const snapshot = await adminDb.collection("districts").orderBy("order").get();
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<DistrictSeed, "id">),
  }));
}

export async function getDistrictById(
  districtId: string,
): Promise<DistrictSeed | null> {
  if (isDemoMode)
    return ISTANBUL_DISTRICTS.find((d) => d.id === districtId) ?? null;
  const snapshot = await adminDb.collection("districts").doc(districtId).get();
  if (!snapshot.exists) {
    return null;
  }
  return { id: snapshot.id, ...(snapshot.data() as Omit<DistrictSeed, "id">) };
}
