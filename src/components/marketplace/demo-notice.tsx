import { Link } from "@/i18n/navigation";
import { House } from "lucide-react";
import { copy as c } from "@/lib/copy";
export function DemoNotice({ locale: l }: { locale: string }) {
  return (
    <div className="empty-state">
      <House size={35} />
      <h3>{c(l, "Take a look around.", "Etrafa bir göz atın.")}</h3>
      <p>
        {c(
          l,
          "You’re viewing a sample collection. Accounts, enquiries and publishing become available when the site is connected to its live service.",
          "Örnek koleksiyonu görüntülüyorsunuz. Site canlı hizmete bağlandığında hesaplar, başvurular ve ilan yayınlama açılır.",
        )}
      </p>
      <Link className="button" href="/search">
        {c(l, "Explore sample homes", "Örnek evleri keşfet")}
      </Link>
    </div>
  );
}
