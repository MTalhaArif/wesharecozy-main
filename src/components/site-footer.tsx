import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Brand } from "@/components/marketplace/brand";
import { copy as c } from "@/lib/copy";
export async function SiteFooter() {
  const l = await getLocale();
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <Brand />
          <p>
            {c(
              l,
              "A place to live. A city to love.",
              "Yaşanacak bir ev. Sevilecek bir şehir.",
            )}
            <br />
            {c(
              l,
              "Find your own corner of Istanbul.",
              "İstanbul’da kendi köşenizi bulun.",
            )}
          </p>
        </div>
        <div>
          <h3>
            {c(l, "Make yourself at home", "Kendinizi evinizde hissedin")}
          </h3>
          <Link href="/search">{c(l, "Explore homes", "Evleri keşfet")}</Link>
          <Link href="/neighborhoods">
            {c(l, "Meet the neighborhoods", "Semtleri tanıyın")}
          </Link>
          <Link href="/saved">
            {c(l, "Your saved places", "Kaydettiğiniz yerler")}
          </Link>
        </div>
        <div>
          <h3>{c(l, "For hosts", "Ev sahipleri için")}</h3>
          <Link href="/listings/new">
            {c(l, "List your space", "İlan ver")}
          </Link>
          <Link href="/my-listings">
            {c(l, "Manage listings", "İlanları yönet")}
          </Link>
          <Link href="/help">{c(l, "How it works", "Nasıl çalışır")}</Link>
        </div>
        <div>
          <h3>{c(l, "A little help", "Yardıma ihtiyacınız var mı?")}</h3>
          <Link href="/help">
            {c(l, "Help & safety", "Yardım ve güvenlik")}
          </Link>
          <Link href="/messages">{c(l, "Your inbox", "Mesaj kutunuz")}</Link>
          <Link href="/help#privacy">
            {c(l, "Privacy & data", "Gizlilik ve veriler")}
          </Link>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <span>© {new Date().getFullYear()} WeShareCozy</span>
        <span>
          {c(l, "Made for life in Istanbul", "İstanbul’da yaşam için")}{" "}
          <span aria-hidden="true">↗</span>
        </span>
        <span>English · Türkçe &nbsp; / &nbsp; TRY ₺</span>
      </div>
    </footer>
  );
}
