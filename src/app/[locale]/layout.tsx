import type { Metadata } from "next";
import { isDemoMode } from "@/lib/runtime";
import { copy as c } from "@/lib/copy";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat/chat-widget";
import "../globals.css";

export const metadata: Metadata = {
  robots: isDemoMode ? { index: false, follow: false } : undefined,
  title: {
    default: "WeShareCozy · Find your home in Istanbul",
    template: "%s · WeShareCozy",
  },
  description:
    "Find rooms, shared homes and monthly rentals in Istanbul. Explore neighborhoods, compare clear costs and connect directly with hosts.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <a href="#main-content" className="skip-link">
              {c(locale, "Skip to content", "İçeriğe geç")}
            </a>
            <SiteHeader locale={locale} />
            {isDemoMode && (
              <div className="preview-banner">
                {c(
                  locale,
                  "Preview collection · Sample homes, photos and prices. Enquiries are disabled.",
                  "Ön izleme · Evler, fotoğraflar ve fiyatlar örnektir. Başvurular kapalıdır.",
                )}
              </div>
            )}
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </div>
          {!isDemoMode && process.env.ANTHROPIC_API_KEY && <ChatWidget />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
