import { SignupForm } from "@/components/signup-form";
import { DemoNotice } from "@/components/marketplace/demo-notice";
import { isDemoMode } from "@/lib/runtime";
import { Link } from "@/i18n/navigation";
import { copy as c } from "@/lib/copy";
export default async function SignupPage({
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
        {c(l, "A PLACE FOR YOUR NEXT CHAPTER", "YENİ HİKÂYENİZE BİR YER")}
      </p>
      <h1>{c(l, "Make yourself at home.", "Kendinizi evinizde hissedin.")}</h1>
      <p>
        {c(
          l,
          "Join WeShareCozy and find your corner of Istanbul.",
          "WeShareCozy’ye katılın ve İstanbul’da kendi köşenizi bulun.",
        )}
      </p>
      {isDemoMode ? <DemoNotice locale={l} /> : <SignupForm nextPath={next} />}
      <div className="auth-bottom">
        {c(l, "Already have an account?", "Zaten hesabınız var mı?")}{" "}
        <Link
          href={next ? `/login?next=${encodeURIComponent(next)}` : "/login"}
        >
          {c(l, "Log in", "Giriş yap")}
        </Link>
      </div>
    </div>
  );
}
