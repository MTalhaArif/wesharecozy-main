import { describe, it, expect } from "vitest";
import { getDemoListings } from "@/lib/demo/listings";
import { matchesFilters, sortListings } from "@/lib/listings/filter-listings";
import { availabilitySchema } from "@/lib/schemas/listing-edit-schema";
import { safeNext } from "@/lib/auth/safe-next";

describe("marketplace search boundaries", () => {
  const home = getDemoListings()[0];
  it("combines price, district, type and included bills without matching unknown fields", () => {
    expect(
      matchesFilters(home, {
        maxRentKurus: home.rentKurus,
        districtIds: ["kadikoy"],
        listingTypes: ["ROOM_IN_SHARED_FLAT"],
        billsIncluded: true,
      }),
    ).toBe(true);
    expect(matchesFilters(home, { maxRentKurus: home.rentKurus - 1 })).toBe(
      false,
    );
    expect(
      matchesFilters(
        { ...home, billsStatus: undefined },
        { billsIncluded: true },
      ),
    ).toBe(false);
  });
  it("does not advertise unknown or later availability as available by a selected date", () => {
    expect(
      matchesFilters(
        { ...home, availableFrom: undefined },
        { availableBy: "2026-10-01" },
      ),
    ).toBe(false);
    expect(
      matchesFilters(
        { ...home, availableFrom: "2026-10-02" },
        { availableBy: "2026-10-01" },
      ),
    ).toBe(false);
    expect(
      matchesFilters(
        { ...home, availableFrom: "2026-10-01" },
        { availableBy: "2026-10-01" },
      ),
    ).toBe(true);
  });
  it("only includes furnished homes with the requested amenities", () => {
    expect(
      matchesFilters({ ...home, furnished: undefined }, { furnished: true }),
    ).toBe(false);
    expect(
      matchesFilters(
        { ...home, amenities: ["wifi"] },
        { amenities: ["workspace"] },
      ),
    ).toBe(false);
  });
  it("sorts numeric rent ascending and descending", () => {
    const all = getDemoListings();
    const ascending = sortListings(all, "price-asc");
    const descending = sortListings(all, "price-desc");
    expect(ascending.map((x) => x.rentKurus)).toEqual(
      [...all.map((x) => x.rentKurus)].sort((a, b) => a - b),
    );
    expect(descending.map((x) => x.rentKurus)).toEqual(
      [...all.map((x) => x.rentKurus)].sort((a, b) => b - a),
    );
  });
});
describe("availability and redirects", () => {
  it("rejects non-existent dates and unknown amenity values", () => {
    expect(
      availabilitySchema.safeParse({ availableFrom: "2026-02-30" }).success,
    ).toBe(false);
    expect(
      availabilitySchema.safeParse({ availableFrom: "2028-02-29" }).success,
    ).toBe(true);
    expect(
      availabilitySchema.safeParse({ amenities: ["verified"] }).success,
    ).toBe(false);
  });
  it("rejects external, protocol-relative, encoded and backslash redirects", () => {
    for (const path of [
      "https://evil.example",
      "//evil.example",
      "/\\evil.example",
      "/%2f%2fevil.example",
      "/admin",
    ])
      expect(safeNext(path)).toBe("/search");
    expect(safeNext("/listings/moda-sunlight")).toBe("/listings/moda-sunlight");
    expect(safeNext("/messages?thread=abc")).toBe("/messages?thread=abc");
  });
});
