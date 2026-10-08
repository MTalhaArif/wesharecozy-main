"use client"; // Leaflet reads window/document at import time; only ever mounted via a dynamic(..., { ssr: false }) import

import { MapContainer, Marker } from "react-leaflet";
import { MapTiles } from "./map-tiles";
import { markerIcon } from "@/lib/leaflet-icon";
import "leaflet/dist/leaflet.css";

// Read-only pin for a listing's jittered (never exact) coordinates.
export function ListingMap({ lat, lng }: { lat: number; lng: number }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-64 w-full rounded-md"
    >
      <MapTiles />
      <Marker position={[lat, lng]} icon={markerIcon} />
    </MapContainer>
  );
}
