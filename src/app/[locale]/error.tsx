"use client"; // Route-level recovery with safe, localized messages.
import { useLocale } from "next-intl";
import { copy as c } from "@/lib/copy";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const l = useLocale();
  return (
    <div className="site-shell section">
      <div className="empty-state">
        <h3>{c(l, "A small detour.", "Küçük bir aksaklık.")}</h3>
        <p>
          {c(
            l,
            "We couldn’t load this page. Please try again in a moment.",
            "Bu sayfa yüklenemedi. Lütfen biraz sonra tekrar deneyin.",
          )}
        </p>
        <button className="button" onClick={reset}>
          {c(l, "Try again", "Tekrar dene")}
        </button>
      </div>
    </div>
  );
}
