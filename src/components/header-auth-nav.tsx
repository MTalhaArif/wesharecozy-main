"use client"; // Firebase session and account menu.
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useLocale } from "next-intl";
import { clientAuth } from "@/lib/firebase-client";
import { checkIsAdmin } from "@/actions/auth/check-is-admin";
import { Link, useRouter } from "@/i18n/navigation";
import { isDemoMode } from "@/lib/runtime";
import { copy as c } from "@/lib/copy";
export function HeaderAuthNav() {
  const locale = useLocale();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    if (isDemoMode) return;
    return onAuthStateChanged(clientAuth, (u) => {
      setUser(u);
      setAdmin(false);
      if (u)
        void u
          .getIdToken()
          .then(checkIsAdmin)
          .then(setAdmin)
          .catch(() => setAdmin(false));
    });
  }, []);
  if (!user)
    return <Link href="/login">{c(locale, "Log in", "Giriş yap")}</Link>;
  return (
    <details className="account-menu">
      <summary>
        {user.displayName?.split(" ")[0] || c(locale, "Account", "Hesap")}
      </summary>
      <div>
        <Link href="/my-listings">{c(locale, "My listings", "İlanlarım")}</Link>
        <Link href="/messages">{c(locale, "Inbox", "Mesajlar")}</Link>
        {admin && <Link href="/admin">Admin</Link>}
        <button
          onClick={async () => {
            await signOut(clientAuth);
            router.push("/");
          }}
        >
          {c(locale, "Log out", "Çıkış yap")}
        </button>
      </div>
    </details>
  );
}
