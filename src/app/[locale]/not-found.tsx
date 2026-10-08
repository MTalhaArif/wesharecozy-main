import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { copy as c } from "@/lib/copy";
export default function NotFound() {
  const l = useLocale();
  return (
    <div className="site-shell section">
      <div className="empty-state">
        <p className="eyebrow green">404</p>
        <h3>
          {c(l, "This door is closed for now.", "Bu kapı şimdilik kapalı.")}
        </h3>
        <p>
          {c(
            l,
            "This page or listing is unavailable. Let’s find another place.",
            "Bu sayfa veya ilan kullanılamıyor. Başka bir yer bulalım.",
          )}
        </p>
        <Link className="button" href="/search">
          {c(l, "Explore homes", "Evleri keşfet")}
        </Link>
      </div>
    </div>
  );
}
