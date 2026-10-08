"use client"; // Mobile navigation disclosure and current route highlighting.
import { useEffect, useState } from "react";
import { Heart, Menu, X, ArrowUpRight } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { HeaderAuthNav } from "@/components/header-auth-nav";
import { copy as c } from "@/lib/copy";
export function HeaderNav({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const path = usePathname();
  return (
    <>
      <button
        className="icon-button mobile-toggle"
        aria-label={c(locale, "Toggle menu", "Menüyü aç/kapat")}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav
        id="main-nav"
        data-ready={ready}
        className={`main-nav ${open ? "is-open" : ""}`}
        aria-label={c(locale, "Main navigation", "Ana menü")}
        onClick={(e) => {
          if ((e.target as Element).closest("a")) setOpen(false);
        }}
      >
        <Link className={path === "/search" ? "nav-active" : ""} href="/search">
          {c(locale, "Find a home", "Ev bul")}
        </Link>
        <Link href="/neighborhoods">
          {c(locale, "Neighborhoods", "Semtler")}
        </Link>
        <Link href="/saved" className="saved-nav">
          <Heart size={17} />
          <span>{c(locale, "Saved", "Kaydedilenler")}</span>
        </Link>
        <LocaleSwitcher currentLocale={locale} />
        <HeaderAuthNav />
        <Link href="/listings/new" className="button button-small">
          {c(locale, "List your space", "İlan ver")}
          <ArrowUpRight size={16} />
        </Link>
      </nav>
    </>
  );
}
