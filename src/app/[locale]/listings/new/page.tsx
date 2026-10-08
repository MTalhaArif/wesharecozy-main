import { getDistricts } from "@/lib/districts/get-districts";
import { CreateListingForm } from "@/components/create-listing-form";
import { copy as c } from "@/lib/copy";
import { Camera, ReceiptText, MapPin } from "lucide-react";
export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  const districts = await getDistricts();
  return (
    <div className="site-shell section">
      <div className="page-heading">
        <p className="eyebrow green">
          {c(
            l,
            "MAKE ROOM FOR A NEW BEGINNING",
            "YENİ BİR BAŞLANGICA YER AÇIN",
          )}
        </p>
        <h1>
          {c(
            l,
            "Your space. Their next chapter.",
            "Sizin eviniz. Onların yeni hikâyesi.",
          )}
        </h1>
        <p>
          {c(
            l,
            "Good listings start with honest details and a little care.",
            "İyi ilanlar doğru bilgiler ve biraz özenle başlar.",
          )}
        </p>
      </div>
      <div className="publish-layout">
        <CreateListingForm districts={districts} locale={l} />
        <aside className="publish-guide">
          <h2>{c(l, "A few thoughtful details.", "Birkaç özenli ayrıntı.")}</h2>
          {[
            [
              Camera,
              c(l, "Show the whole picture", "Evi tüm yönleriyle gösterin"),
              c(
                l,
                "Use clear, recent photos of the room and shared spaces.",
                "Odanın ve ortak alanların net, güncel fotoğraflarını kullanın.",
              ),
            ],
            [
              ReceiptText,
              c(l, "Keep costs clear", "Masrafları açıkça belirtin"),
              c(
                l,
                "Include the rent, deposit, bills and the deposit return terms.",
                "Kira, depozito, faturalar ve depozito iade şartlarını belirtin.",
              ),
            ],
            [
              MapPin,
              c(l, "Your address stays private", "Adresiniz gizli kalır"),
              c(
                l,
                "Only an approximate map pin appears on your public listing.",
                "Herkese açık ilanda yalnızca yaklaşık bir harita konumu gösterilir.",
              ),
            ],
          ].map(([Icon, title, text], i) => {
            const I = Icon as typeof Camera;
            return (
              <div key={i}>
                <I size={22} />
                <h3>{title as string}</h3>
                <p>{text as string}</p>
              </div>
            );
          })}
        </aside>
      </div>
    </div>
  );
}
