import Image from "next/image";
import { getLocale } from "next-intl/server";
import { copy as c } from "@/lib/copy";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const l = await getLocale();
  return (
    <div className="site-shell auth-shell">
      <div className="auth-visual">
        <Image
          src="/images/istanbul.jpg"
          alt="İstanbul"
          width="800"
          height="1100"
        />
        <div>
          <p className="eyebrow">WeShareCozy · İstanbul</p>
          <h2>
            {c(
              l,
              "A new chapter. A place to belong.",
              "Yeni bir hikâye. Ait olduğunuz bir yer.",
            )}
          </h2>
        </div>
      </div>
      <div className="auth-content">{children}</div>
    </div>
  );
}
