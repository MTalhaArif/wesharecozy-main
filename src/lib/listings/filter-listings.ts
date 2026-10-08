import type { PublicListing } from "./get-listing";
import type {
  ListingType,
  GenderPreference,
} from "@/lib/schemas/listing-schema";
export type ListingSearchFilters = {
  districtIds?: string[];
  listingTypes?: ListingType[];
  minRentKurus?: number;
  maxRentKurus?: number;
  roomCount?: number;
  genderPreference?: GenderPreference;
  billsIncluded?: boolean;
  furnished?: boolean;
  availableBy?: string;
  amenities?: string[];
  sort?: "newest" | "price-asc" | "price-desc";
  limit?: number;
  cursor?: string;
};
export function matchesFilters(
  l: PublicListing,
  f: ListingSearchFilters,
): boolean {
  return (
    (!f.districtIds?.length || f.districtIds.includes(l.districtId)) &&
    (!f.listingTypes?.length || f.listingTypes.includes(l.type)) &&
    (f.minRentKurus == null || l.rentKurus >= f.minRentKurus) &&
    (f.maxRentKurus == null || l.rentKurus <= f.maxRentKurus) &&
    (!f.roomCount || l.roomCount === f.roomCount) &&
    (!f.genderPreference ||
      f.genderPreference === "ANY" ||
      l.genderPreference === "ANY" ||
      l.genderPreference === f.genderPreference) &&
    (!f.billsIncluded || l.billsStatus === "INCLUDED") &&
    (!f.furnished || l.furnished === true) &&
    (!f.availableBy ||
      (!!l.availableFrom && l.availableFrom <= f.availableBy)) &&
    (!f.amenities?.length || f.amenities.every((a) => l.amenities?.includes(a)))
  );
}
export function sortListings(
  listings: PublicListing[],
  sort: ListingSearchFilters["sort"],
) {
  return [...listings].sort((a, b) => {
    const diff =
      sort === "price-asc"
        ? a.rentKurus - b.rentKurus
        : sort === "price-desc"
          ? b.rentKurus - a.rentKurus
          : 0;
    return (
      diff ||
      (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0) ||
      a.id.localeCompare(b.id)
    );
  });
}
