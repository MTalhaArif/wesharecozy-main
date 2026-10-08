"use client"; // next/dynamic with ssr:false is only allowed from a Client Component

import dynamic from "next/dynamic";
import { MapLoading } from "./map-loading";

const ListingMap = dynamic(
  () => import("@/components/listing-map").then((mod) => mod.ListingMap),
  {
    ssr: false,
    loading: () => <MapLoading />,
  },
);

export function ListingMapLoader({ lat, lng }: { lat: number; lng: number }) {
  return <ListingMap lat={lat} lng={lng} />;
}
