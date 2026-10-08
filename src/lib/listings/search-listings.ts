import { Timestamp } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase-admin";
import { mapPublicListing, type PublicListing } from "./get-listing";
import { isListingExpired } from "./is-expired";
import {
  matchesFilters,
  sortListings,
  type ListingSearchFilters,
} from "./filter-listings";
import { isDemoMode } from "@/lib/runtime";
import { getDemoListings } from "@/lib/demo/listings";
export type { ListingSearchFilters } from "./filter-listings";

export async function searchListingPage(filters: ListingSearchFilters) {
  const limit = Math.max(1, Math.min(filters.limit ?? 12, 60));
  if (isDemoMode) {
    const all = sortListings(
      getDemoListings().filter((l) => matchesFilters(l, filters)),
      filters.sort,
    );
    const start = filters.cursor
      ? Math.max(0, all.findIndex((l) => l.id === filters.cursor) + 1)
      : 0;
    const items = all.slice(start, start + limit);
    return {
      items,
      nextCursor: start + limit < all.length ? items.at(-1)!.id : null,
    };
  }
  // Bounded indexed batches: never fetch the entire collection. Filtering scans
  // continue with a cursor; no matching record is skipped between pages.
  let query: FirebaseFirestore.Query = adminDb
    .collection("listings")
    .where("status", "==", "PUBLISHED")
    .where(
      "publishedAt",
      ">",
      Timestamp.fromMillis(Date.now() - 30 * 86400000),
    );
  if (filters.sort === "price-asc" || filters.sort === "price-desc") {
    query = query.where("rentKurus", ">=", filters.minRentKurus ?? 0);
    if (filters.maxRentKurus != null)
      query = query.where("rentKurus", "<=", filters.maxRentKurus);
    query = query.orderBy(
      "rentKurus",
      filters.sort === "price-asc" ? "asc" : "desc",
    );
  }
  query = query.orderBy("publishedAt", "desc");
  let cursor: FirebaseFirestore.DocumentSnapshot | undefined;
  if (filters.cursor && /^[a-zA-Z0-9_-]{1,150}$/.test(filters.cursor)) {
    const doc = await adminDb.collection("listings").doc(filters.cursor).get();
    if (doc.exists && doc.data()?.publishedAt) cursor = doc;
  }
  const items: PublicListing[] = [];
  for (let batch = 0; batch < 8; batch++) {
    const snapshot = await (cursor ? query.startAfter(cursor) : query)
      .limit(80)
      .get();
    for (const doc of snapshot.docs) {
      const listing = mapPublicListing(doc);
      if (
        !isListingExpired(listing.publishedAt) &&
        matchesFilters(listing, filters)
      ) {
        if (items.length === limit)
          return { items, nextCursor: cursor?.id ?? null };
        items.push(listing);
      }
      cursor = doc;
    }
    if (snapshot.size < 80) return { items, nextCursor: null };
  }
  return { items, nextCursor: cursor?.id ?? null };
}
export async function searchListings(
  filters: ListingSearchFilters,
): Promise<PublicListing[]> {
  return (await searchListingPage(filters)).items;
}
