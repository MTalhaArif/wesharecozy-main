"use client"; // Localized loading state for dynamically imported maps.
import { useLocale } from "next-intl";
import { copy as c } from "@/lib/copy";

export function MapLoading() {
  const locale = useLocale();
  return (
    <div className="map-loading" role="status">
      {c(locale, "Loading map…", "Harita yükleniyor…")}
    </div>
  );
}
