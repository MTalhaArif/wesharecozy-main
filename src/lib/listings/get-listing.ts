import { isDemoMode } from "@/lib/runtime";
import { getDemoListings } from "@/lib/demo/listings";
import { adminDb } from "@/lib/firebase-admin";
import type {
  BillsStatus,
  GenderPreference,
  ListingType,
} from "@/lib/schemas/listing-schema";

export type ListingStatus = "DRAFT" | "PUBLISHED" | "DEACTIVATED" | "REMOVED";

// Deliberately reads only the public listings/{id} document, never the
// private/location subcollection — exact coordinates must never reach here.
export type PublicListing = {
  id: string;
  ownerUid: string;
  type: ListingType;
  status: ListingStatus;
  districtId: string;
  neighborhood: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  rentKurus: number;
  depositKurus: number;
  roomCount: number;
  genderPreference: GenderPreference;
  // Optional -- listings published before this field set was added won't
  // have them; every read path must treat their absence as "not stated",
  // never as a false "No"/"Excluded".
  aboutText?: string;
  depositReturnPolicy?: string;
  contractAvailable?: boolean;
  billsStatus?: BillsStatus;
  photoUrls: string[];
  jitteredLat: number;
  jitteredLng: number;
  publishedAt: Date | null;
  createdAt: Date;
  furnished?: boolean;
  amenities?: string[];
  availableFrom?: string;
  minStayMonths?: number;
  isSample?: boolean;
};

export function mapPublicListing(
  snapshot: FirebaseFirestore.DocumentSnapshot,
): PublicListing {
  const data = snapshot.data()!;
  return {
    id: snapshot.id,
    ownerUid: data.ownerUid,
    type: data.type,
    status: data.status,
    districtId: data.districtId,
    neighborhood: data.neighborhood,
    titleTr: data.titleTr,
    titleEn: data.titleEn,
    descriptionTr: data.descriptionTr,
    descriptionEn: data.descriptionEn,
    rentKurus: data.rentKurus,
    depositKurus: data.depositKurus,
    roomCount: data.roomCount,
    genderPreference: data.genderPreference,
    aboutText: data.aboutText ?? undefined,
    depositReturnPolicy: data.depositReturnPolicy ?? undefined,
    contractAvailable:
      typeof data.contractAvailable === "boolean"
        ? data.contractAvailable
        : undefined,
    billsStatus: data.billsStatus ?? undefined,
    photoUrls: data.photoUrls ?? [],
    jitteredLat: data.jitteredLat,
    jitteredLng: data.jitteredLng,
    publishedAt: data.publishedAt ? data.publishedAt.toDate() : null,
    createdAt: data.createdAt.toDate(),
    furnished: data.furnished,
    amenities: data.amenities ?? [],
    availableFrom: data.availableFrom,
    minStayMonths: data.minStayMonths,
  };
}

export async function getListing(
  listingId: string,
): Promise<PublicListing | null> {
  if (isDemoMode)
    return getDemoListings().find((l) => l.id === listingId) ?? null;
  const snapshot = await adminDb.collection("listings").doc(listingId).get();
  if (!snapshot.exists) {
    return null;
  }
  return mapPublicListing(snapshot);
}
