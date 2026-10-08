"use client"; // Map tile failures need an accessible fallback inside Leaflet.

import { useState } from "react";
import { TileLayer, useMap } from "react-leaflet";
import { useLocale } from "next-intl";
import { copy as c } from "@/lib/copy";

export function MapTiles({ selecting = false }: { selecting?: boolean }) {
  const [failed, setFailed] = useState(false);
  const map = useMap();
  const l = useLocale();
  const center = map.getCenter();
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{ tileerror: () => setFailed(true) }}
      />
      {failed && (
        <div
          className="map-unavailable"
          role="status"
          onClick={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <p>
            {c(
              l,
              "Map details couldn't load.",
              "Harita ayrıntıları yüklenemedi.",
            )}
          </p>
          {selecting ? (
            <span>
              {c(
                l,
                "Check your connection and reload before choosing a location.",
                "Konum seçmeden önce bağlantınızı kontrol edin ve sayfayı yenileyin.",
              )}
            </span>
          ) : (
            <a
              href={`https://www.openstreetmap.org/#map=${map.getZoom()}/${center.lat.toFixed(5)}/${center.lng.toFixed(5)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c(
                l,
                "Open this area in OpenStreetMap",
                "Bu bölgeyi OpenStreetMap'te aç",
              )}
            </a>
          )}
        </div>
      )}
    </>
  );
}
