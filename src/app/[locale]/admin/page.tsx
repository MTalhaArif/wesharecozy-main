import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminReports } from "@/components/marketplace/admin-reports";
import { DemoNotice } from "@/components/marketplace/demo-notice";
import { isDemoMode } from "@/lib/runtime";
import { copy as c } from "@/lib/copy";
export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: l } = await params;
  return (
    <div className="site-shell section">
      <div className="page-heading">
        <h1>{c(l, "Admin workspace.", "Yönetici paneli.")}</h1>
      </div>
      {isDemoMode ? (
        <DemoNotice locale={l} />
      ) : (
        <>
          <AdminReports />
          <AdminDashboard />
        </>
      )}
    </div>
  );
}
