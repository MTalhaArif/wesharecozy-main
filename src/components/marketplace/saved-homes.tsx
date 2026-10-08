"use client"; // Reads the device-local shortlist after hydration.
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocale } from "next-intl";
import { ListingCard } from "@/components/listing-card";
import { readSaved } from "./save-button";
import type { PublicListing } from "@/lib/listings/get-listing";
import { Link } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
export function SavedHomes() {
  const l = useLocale();
  const [homes, setHomes] = useState<PublicListing[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setHomes(readSaved());
      setReady(true);
    };
    sync();
    window.addEventListener("cozy-saved", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cozy-saved", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return (
    <div className="site-shell section saved-page">
      <div className="page-heading">
        <p className="eyebrow green">
          {c(l, "YOUR LITTLE SHORTLIST", "KÜÇÜK FAVORİ LİSTENİZ")}
        </p>
        <h1>
          {c(l, "Places you’re dreaming of.", "Hayalini kurduğunuz evler.")}
        </h1>
        <p>
          {c(
            l,
            "Saved on this device. Open a home for its latest price and availability.",
            "Bu cihazda kaydedilir. Güncel fiyat ve müsaitlik için ilanı açın.",
          )}
        </p>
      </div>
      {!ready ? (
        <p>{c(l, "Loading saved homes…", "Kaydedilen evler yükleniyor…")}</p>
      ) : homes.length ? (
        <div className="home-grid">
          {homes.map((x) => (
            <ListingCard key={x.id} listing={x} locale={l} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={36} />
          <h3>
            {c(
              l,
              "A home worth coming back to.",
              "Tekrar bakmaya değer bir ev.",
            )}
          </h3>
          <p>
            {c(
              l,
              "Tap the heart on a home to keep it here.",
              "Buraya kaydetmek için ilandaki kalbe dokunun.",
            )}
          </p>
          <Link href="/search" className="button">
            {c(l, "Find a home", "Ev bul")}
          </Link>
        </div>
      )}
    </div>
  );
}
