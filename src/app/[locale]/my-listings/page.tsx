import { MyListingsDashboard } from "@/components/my-listings-dashboard";
import { DemoNotice } from "@/components/marketplace/demo-notice";
import { isDemoMode } from "@/lib/runtime";
import { copy as c } from "@/lib/copy";
export default async function MyListingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  return (
    <div className="site-shell section">
      <div className="page-heading">
        <p className="eyebrow green">
          {c(l, "YOUR SPACES, ALL IN ONE PLACE", "TÜM EVLERİNİZ TEK YERDE")}
        </p>
        <h1>{c(l, "Your hosting corner.", "Ev sahibi paneliniz.")}</h1>
        <p>
          {c(
            l,
            "Keep details up to date, manage enquiries and renew available homes.",
            "Bilgileri güncelleyin, başvuruları yönetin ve müsait evleri yeniden yayınlayın.",
          )}
        </p>
      </div>
      {isDemoMode ? <DemoNotice locale={l} /> : <MyListingsDashboard />}
    </div>
  );
}
