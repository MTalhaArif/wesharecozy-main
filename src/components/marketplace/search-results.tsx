"use client"; // Switchable list/map layout.
import { useState } from "react";
import dynamic from "next/dynamic";
import { MapLoading } from "@/components/map-loading";
import { Map, LayoutGrid } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import type { PublicListing } from "@/lib/listings/get-listing";
import { copy as c } from "@/lib/copy";
const ResultsMap = dynamic(
  () => import("./results-map").then((m) => m.ResultsMap),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);
export function SearchResults({
  listings,
  locale: l,
}: {
  listings: PublicListing[];
  locale: string;
}) {
  const [map, setMap] = useState(false);
  return (
    <>
      <div className="results-toolbar">
        <p>
          {listings.length} {c(l, "homes on this page", "ev bu sayfada")}
        </p>
        <button
          className="button button-outline button-small"
          onClick={() => setMap(!map)}
          aria-pressed={map}
        >
          {map ? <LayoutGrid size={16} /> : <Map size={16} />}{" "}
          {c(
            l,
            map ? "Show list" : "Show map",
            map ? "Listeyi göster" : "Haritayı göster",
          )}
        </button>
      </div>
      <div className={map ? "results-layout with-map" : "results-layout"}>
        <div className="search-grid">
          {listings.map((x) => (
            <ListingCard key={x.id} listing={x} locale={l} />
          ))}
        </div>
        {map && <ResultsMap listings={listings} locale={l} />}
      </div>
    </>
  );
}
