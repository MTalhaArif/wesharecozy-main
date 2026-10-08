import { LoginForm } from "@/components/login-form";
import { DemoNotice } from "@/components/marketplace/demo-notice";
import { isDemoMode } from "@/lib/runtime";
import { Link } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale: l } = await params;
  const { next } = await searchParams;
  return (
    <div className="auth-form-wrap">
      <p className="eyebrow green">
        {c(
          l,
          "YOUR ISTANBUL STARTS HERE",
          "İSTANBUL HİKÂYENİZ BURADA BAŞLIYOR",
        )}
      </p>
      <h1>{c(l, "Welcome home.", "Evinize hoş geldiniz.")}</h1>
      <p>
        {c(
          l,
          "Log in to connect with hosts and manage your spaces.",
          "Ev sahipleriyle iletişim kurmak ve evlerinizi yönetmek için giriş yapın.",
        )}
      </p>
      {isDemoMode ? <DemoNotice locale={l} /> : <LoginForm nextPath={next} />}
      <div className="auth-bottom">
        {c(l, "New around here?", "Burada yeni misiniz?")}{" "}
        <Link
          href={next ? `/signup?next=${encodeURIComponent(next)}` : "/signup"}
        >
          {c(l, "Create an account", "Hesap oluştur")}
        </Link>
      </div>
    </div>
  );
}
