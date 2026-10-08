import { notFound } from "next/navigation";
import { House, ArrowRight } from "lucide-react";
import { getDistricts } from "@/lib/districts/get-districts";
import { searchListingPage } from "@/lib/listings/search-listings";
import {
  listingTypeSchema,
  genderPreferenceSchema,
} from "@/lib/schemas/listing-schema";
import { SearchControls } from "@/components/marketplace/search-controls";
import { SearchResults } from "@/components/marketplace/search-results";
import { Link } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
const positive = (s: string | undefined) =>
  s && Number.isFinite(Number(s)) && Number(s) > 0 ? Number(s) : undefined;
export async function ListingSearchPage({
  locale: l,
  filters: f,
  fixedDistrictId,
}: {
  locale: string;
  filters: Record<string, string | undefined>;
  fixedDistrictId?: string;
}) {
  const districts = await getDistricts();
  const selected = fixedDistrictId ?? f.district;
  const district = districts.find((x) => x.id === selected);
  if (fixedDistrictId && !district) notFound();
  const type = listingTypeSchema.safeParse(f.type);
  const gender = genderPreferenceSchema.safeParse(f.gender);
  const min = positive(f.minRent);
  const max = positive(f.maxRent);
  const invalidRange = !!min && !!max && min > max;
  const result = invalidRange
    ? { items: [], nextCursor: null }
    : await searchListingPage({
        districtIds: district ? [district.id] : undefined,
        listingTypes: type.success ? [type.data] : undefined,
        genderPreference: gender.success ? gender.data : undefined,
        minRentKurus: min ? min * 100 : undefined,
        maxRentKurus: max ? max * 100 : undefined,
        roomCount: positive(f.rooms),
        billsIncluded: f.bills === "included",
        furnished: f.furnished === "yes",
        availableBy:
          f.availableBy && /^\d{4}-\d{2}-\d{2}$/.test(f.availableBy)
            ? f.availableBy
            : undefined,
        amenities: f.amenity === "workspace" ? ["workspace"] : undefined,
        sort:
          f.sort === "price-asc" || f.sort === "price-desc" ? f.sort : "newest",
        cursor: f.cursor,
        limit: 12,
      });
  const next = new URLSearchParams(
    Object.entries({
      ...f,
      district: district?.id,
      cursor: result.nextCursor ?? undefined,
    }).filter((x): x is [string, string] => typeof x[1] === "string"),
  );
  return (
    <div className="site-shell search-page">
      <div className="page-heading">
        <div className="breadcrumbs">
          <Link href="/">{c(l, "Home", "Ana sayfa")}</Link> /{" "}
          {c(l, "Find your place", "Evinizi bulun")}
        </div>
        <p className="eyebrow green">
          {c(l, "A NEW CHAPTER STARTS HERE", "YENİ HİKÂYENİZ BURADA BAŞLIYOR")}
        </p>
        <h1>
          {district
            ? c(
                l,
                `Make yourself at home in ${district.nameTr}.`,
                `${district.nameTr}’de evinizde hissedin.`,
              )
            : c(
                l,
                "Find your place in Istanbul.",
                "İstanbul’da yerinizi bulun.",
              )}
        </h1>
        <p>
          {c(
            l,
            "Your budget. Your neighborhood. Your kind of space.",
            "Sizin bütçeniz. Sizin semtiniz. Size göre bir ev.",
          )}
        </p>
      </div>
      <SearchControls
        key={JSON.stringify(f) + selected}
        locale={l}
        districts={districts}
        filters={{ ...f, district: district?.id }}
      />
      <div className="active-filter-line">
        <Link className="text-link" href="/search">
          {c(l, "Reset all filters", "Tüm filtreleri sıfırla")}
        </Link>
        {invalidRange && (
          <p role="alert" className="feedback error">
            {c(
              l,
              "Maximum rent must be at least the minimum rent.",
              "En yüksek kira, en düşük kiradan az olamaz.",
            )}
          </p>
        )}
      </div>
      {result.items.length > 0 ? (
        <SearchResults listings={result.items} locale={l} />
      ) : (
        <div className="empty-state">
          <House size={38} />
          <h3>
            {c(l, "Let’s open up the search.", "Aramayı biraz genişletelim.")}
          </h3>
          <p>
            {c(
              l,
              "No homes found here. Try another neighborhood or a wider budget.",
              "Burada ev bulunamadı. Başka bir semt veya daha geniş bir bütçe deneyin.",
            )}
          </p>
          <Link className="button" href="/search">
            {c(l, "Explore all homes", "Tüm evleri keşfet")}
          </Link>
        </div>
      )}
      {result.nextCursor && (
        <div className="pagination">
          <Link
            className="button button-outline"
            href={`/search?${next.toString()}`}
          >
            {c(l, "Next homes", "Sonraki evler")}
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
