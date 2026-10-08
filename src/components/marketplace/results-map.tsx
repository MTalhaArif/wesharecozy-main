"use client"; // Leaflet is loaded in a client-only boundary.
import { MapContainer, Marker, Popup } from "react-leaflet";
import { MapTiles } from "@/components/map-tiles";
import { divIcon, latLngBounds } from "leaflet";
import type { PublicListing } from "@/lib/listings/get-listing";
import { money, copy as c } from "@/lib/copy";
import { Link } from "@/i18n/navigation";
import "leaflet/dist/leaflet.css";
export function ResultsMap({
  listings,
  locale: l,
}: {
  listings: PublicListing[];
  locale: string;
}) {
  const points = listings.map(
    (x) => [x.jitteredLat, x.jitteredLng] as [number, number],
  );
  return (
    <div className="results-map">
      <MapContainer
        bounds={points.length ? latLngBounds(points).pad(0.25) : undefined}
        center={points.length ? undefined : [41.025, 28.985]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
        key={listings.map((x) => x.id).join(",")}
      >
        <MapTiles />
        {listings.map((x) => (
          <Marker
            key={x.id}
            position={[x.jitteredLat, x.jitteredLng]}
            icon={divIcon({
              className: "price-marker",
              html: `<span>${money(x.rentKurus, l)}</span>`,
              iconSize: [85, 32],
              iconAnchor: [42, 16],
            })}
          >
            <Popup>
              <Link href={`/listings/${x.id}`}>
                {l === "tr" ? x.titleTr : x.titleEn}
                <br />
                {money(x.rentKurus, l)} / {c(l, "month", "ay")}
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <p>
        {c(
          l,
          "Approximate locations · Exact addresses stay private",
          "Yaklaşık konumlar · Tam adresler gizli tutulur",
        )}
      </p>
    </div>
  );
}
