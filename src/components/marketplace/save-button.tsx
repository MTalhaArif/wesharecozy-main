"use client"; // Device-local shortlist with cross-tab updates.
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocale } from "next-intl";
import { copy as c } from "@/lib/copy";
import type { PublicListing } from "@/lib/listings/get-listing";
export const SAVED_KEY = "wesharecozy_saved_v1";
export function readSaved(): PublicListing[] {
  try {
    const list = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    return Array.isArray(list)
      ? list.filter(
          (x) =>
            typeof x?.id === "string" &&
            typeof x?.titleEn === "string" &&
            Array.isArray(x?.photoUrls),
        )
      : [];
  } catch {
    return [];
  }
}
export function SaveButton({
  listing,
  withLabel = false,
}: {
  listing: PublicListing;
  withLabel?: boolean;
}) {
  const l = useLocale();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    const sync = () => setSaved(readSaved().some((x) => x.id === listing.id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("cozy-saved", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("cozy-saved", sync);
    };
  }, [listing.id]);
  const label = c(
    l,
    saved ? "Remove from saved" : "Save this home",
    saved ? "Kaydedilenlerden kaldır" : "Evi kaydet",
  );
  return (
    <>
      <button
        className={withLabel ? "button button-outline" : "save-button"}
        aria-label={label}
        aria-pressed={saved}
        title={label}
        onClick={() => {
          try {
            const all = readSaved();
            localStorage.setItem(
              SAVED_KEY,
              JSON.stringify(
                saved
                  ? all.filter((x) => x.id !== listing.id)
                  : [listing, ...all].slice(0, 100),
              ),
            );
            window.dispatchEvent(new Event("cozy-saved"));
            setError(false);
          } catch {
            setError(true);
          }
        }}
      >
        <Heart size={19} fill={saved ? "currentColor" : "none"} />
        {withLabel &&
          c(l, saved ? "Saved" : "Save", saved ? "Kaydedildi" : "Kaydet")}
      </button>
      {error && (
        <span role="alert" className="save-error">
          {c(
            l,
            "Browser storage is unavailable.",
            "Tarayıcı depolaması kullanılamıyor.",
          )}
        </span>
      )}
    </>
  );
}
