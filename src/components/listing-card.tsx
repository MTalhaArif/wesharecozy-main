/* eslint-disable @next/next/no-img-element -- Firebase and local gallery URLs use explicit sizing and lazy loading. */
import { ArrowUpRight, Home, Armchair } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SaveButton } from "@/components/marketplace/save-button";
import type { PublicListing } from "@/lib/listings/get-listing";
import { copy as c, money, typeLabel } from "@/lib/copy";
export function ListingCard({
  listing,
  locale,
}: {
  listing: PublicListing;
  locale: string;
}) {
  const title = locale === "tr" ? listing.titleTr : listing.titleEn;
  return (
    <article className="listing-card">
      <div className="listing-photo">
        <Link href={`/listings/${listing.id}`} tabIndex={-1} aria-hidden="true">
          {listing.photoUrls[0] ? (
            <img
              src={listing.photoUrls[0]}
              alt=""
              loading="lazy"
              width="600"
              height="450"
            />
          ) : (
            <div className="photo-placeholder">
              <Home size={42} />
            </div>
          )}
        </Link>
        <span className="photo-chip">
          {listing.isSample
            ? c(locale, "Sample home", "Örnek ev")
            : typeLabel(listing.type, locale)}
        </span>
        <SaveButton listing={listing} />
      </div>
      <div className="listing-card-body">
        <div className="card-location">
          {listing.neighborhood}{" "}
          <span>· {typeLabel(listing.type, locale)}</span>
        </div>
        <Link href={`/listings/${listing.id}`} className="card-title">
          <h3>{title}</h3>
          <ArrowUpRight size={17} />
        </Link>
        <p className="card-features">
          <Home size={14} />
          {listing.roomCount} {c(locale, "rooms", "oda")}
          {listing.furnished && (
            <>
              <span>·</span>
              <Armchair size={14} />
              {c(locale, "Furnished", "Eşyalı")}
            </>
          )}
        </p>
        <div className="card-price">
          <div>
            <strong>{money(listing.rentKurus, locale)}</strong>
            <span> / {c(locale, "month", "ay")}</span>
          </div>
          <small>
            {listing.billsStatus === "INCLUDED"
              ? c(locale, "Bills included", "Faturalar dahil")
              : c(locale, "View costs", "Masrafları gör")}
          </small>
        </div>
      </div>
    </article>
  );
}
