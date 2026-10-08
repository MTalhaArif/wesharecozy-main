import { Brand } from "@/components/marketplace/brand";
import { HeaderNav } from "@/components/marketplace/header-nav";
export function SiteHeader({ locale }: { locale: string }) {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Brand />
        <HeaderNav locale={locale} />
      </div>
    </header>
  );
}
