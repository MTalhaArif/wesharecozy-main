import { Link } from "@/i18n/navigation";
import { HELP_ARTICLES } from "@/lib/ai/help-articles";
import { copy as c } from "@/lib/copy";
export const metadata = { title: "Help & safety" };
export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  return (
    <div className="site-shell section">
      <div className="content-width">
        <div className="page-heading">
          <p className="eyebrow green">
            {c(
              l,
              "A LITTLE GUIDANCE GOES A LONG WAY",
              "KÜÇÜK BİR REHBER BÜYÜK FARK YARATIR",
            )}
          </p>
          <h1>
            {c(
              l,
              "Feel at home, from the start.",
              "İlk günden evinizde hissedin.",
            )}
          </h1>
          <p>
            {c(
              l,
              "How to find a place, connect with a host and make an informed move.",
              "Ev bulma, ev sahibiyle iletişim kurma ve bilinçli bir karar verme rehberi.",
            )}
          </p>
        </div>
        {Object.entries(HELP_ARTICLES).map(([slug, article]) => (
          <details className="help-item" key={slug}>
            <summary>{article[l === "tr" ? "tr" : "en"].title}</summary>
            <p>{article[l === "tr" ? "tr" : "en"].body}</p>
            <Link className="text-link" href={`/help/${slug}`}>
              {c(l, "Open guide", "Rehberi aç")} ↗
            </Link>
          </details>
        ))}
        <section className="prose-section" id="privacy">
          <h2>
            {c(l, "Your information, explained", "Bilgileriniz hakkında")}
          </h2>
          <p>
            {c(
              l,
              "Public listings show the neighborhood and an approximate map pin. The exact location is stored privately. Your email and phone are not shown on public profiles. If you submit a contact request, your chosen contact details are shared with that listing’s host. Messages are available to the participants through their accounts. Saved homes stay in this browser’s local storage.",
              "Herkese açık ilanlar semti ve yaklaşık harita konumunu gösterir. Tam konum gizli saklanır. E-posta ve telefonunuz herkese açık profillerde gösterilmez. İletişim talebi gönderirseniz seçtiğiniz iletişim bilgileri ilan sahibiyle paylaşılır. Mesajlara katılımcılar hesaplarından erişir. Kaydedilen evler bu tarayıcının yerel depolamasında tutulur.",
            )}
          </p>
        </section>
        <section className="prose-section">
          <h2>
            {c(
              l,
              "Need to flag a problem?",
              "Bir sorun mu bildirmek istiyorsunuz?",
            )}
          </h2>
          <p>
            {c(
              l,
              "Use “Report this listing” on the home’s page to send a report to the site administrator. Never share passwords, bank details or identity documents in listing descriptions or ordinary chat.",
              "Site yöneticisine bildirmek için ev sayfasındaki “İlanı bildir” seçeneğini kullanın. Şifrelerinizi, banka bilgilerinizi veya kimlik belgelerinizi ilan açıklamalarında ya da normal sohbetlerde paylaşmayın.",
            )}
          </p>
        </section>
      </div>
    </div>
  );
}
