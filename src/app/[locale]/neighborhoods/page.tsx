import { ArrowUpRight, Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ISTANBUL_DISTRICTS } from "@/lib/districts/district-data";
import { copy as c } from "@/lib/copy";
export const metadata = { title: "Istanbul neighborhoods" };
export default async function NeighborhoodsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  const descriptions: Record<string, [string, string]> = {
    kadikoy: [
      "A starting point for exploring the Asian side. Compare the home’s exact position with your daily commute.",
      "Anadolu Yakası’nı keşfetmek için bir başlangıç. Evin tam konumunu günlük ulaşımınızla karşılaştırın.",
    ],
    besiktas: [
      "Explore homes around the European shore. Check the route to your work or university before choosing.",
      "Avrupa kıyısındaki evleri keşfedin. Seçmeden önce işinize veya üniversitenize ulaşımı kontrol edin.",
    ],
    beyoglu: [
      "Discover the streets around central Istanbul. Ask about building access, hills and evening noise.",
      "İstanbul’un merkezindeki sokakları keşfedin. Bina erişimini, yokuşları ve akşam gürültüsünü sorun.",
    ],
    uskudar: [
      "Find your corner on the Asian shore. Compare transit connections and walking distances.",
      "Anadolu kıyısında kendi köşenizi bulun. Ulaşım bağlantılarını ve yürüme mesafelerini karşılaştırın.",
    ],
  };
  return (
    <div className="site-shell section">
      <div className="page-heading">
        <p className="eyebrow green">
          {c(
            l,
            "TWO SIDES. SO MANY POSSIBILITIES.",
            "İKİ YAKA. SAYISIZ OLASILIK.",
          )}
        </p>
        <h1>
          {c(
            l,
            "Find your rhythm in Istanbul.",
            "İstanbul’da kendi ritminizi bulun.",
          )}
        </h1>
        <p>
          {c(
            l,
            "Choose a neighborhood around the life you want to build. Always confirm actual travel times from the home.",
            "Kurmak istediğiniz yaşama uygun bir semt seçin. Evden gerçek ulaşım sürelerini mutlaka teyit edin.",
          )}
        </p>
      </div>
      <div className="neighborhood-guide">
        {ISTANBUL_DISTRICTS.map((d, i) => (
          <article key={d.id} className="guide-card">
            <div className="guide-icon">
              <Compass size={25} />
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h2>{d.nameTr}</h2>
            <p>
              {descriptions[d.id]
                ? c(l, ...descriptions[d.id])
                : c(
                    l,
                    "Compare monthly homes, room options and the details that matter for your day-to-day life.",
                    "Aylık evleri, oda seçeneklerini ve günlük yaşamınız için önemli ayrıntıları karşılaştırın.",
                  )}
            </p>
            <Link className="text-link" href={`/search/${d.id}`}>
              {c(l, "Explore homes", "Evleri keşfet")}
              <ArrowUpRight size={17} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
