"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { nav, site } from "@/content/site";
import { useUI } from "./UI";

export default function Header() {
  const pathname = usePathname();
  const { openAI, openPalette, openPreferences } = useUI();
  const menu = useRef<HTMLDialogElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // Close the mobile menu after navigating.
  useEffect(() => {
    menu.current?.close();
  }, [pathname]);

  return (
    <header className="site-header tone-ink">
      <div className="wrap site-header__bar">
        <Link href="/" className="wordmark" aria-label={`${site.name} — home`}>
          <span className="wordmark__mark" aria-hidden="true" />
          <span className="wordmark__name">{site.name}</span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__tools">
          {site.availability.open && (
            <Link href="/contact" className="status-pill" title={site.availability.label}>
              <span className="status-pill__dot" aria-hidden="true" />
              <span className="status-pill__text">{site.availability.short}</span>
              <span className="sr-only"> — {site.availability.label}</span>
            </Link>
          )}
          <button type="button" className="icon-btn search-btn" onClick={openPalette} aria-label="Search and commands (Ctrl or Command + K)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="icon-btn prefs-btn" onClick={openPreferences} aria-label="Display and privacy settings">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none" />
            </svg>
          </button>
          <button type="button" className="btn btn--primary btn--sm ask-btn" onClick={() => openAI({ entry: "nav" })}>
            Ask Riyad AI
          </button>
          <button type="button" className="icon-btn menu-btn" onClick={() => menu.current?.showModal()} aria-label="Open menu" aria-haspopup="dialog">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      <dialog ref={menu} className="mobile-menu tone-ink" aria-label="Menu">
        <div className="mobile-menu__panel">
          <div className="mobile-menu__top">
            <span className="wordmark__name">{site.name}</span>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => menu.current?.close()}>
              Close menu
            </button>
          </div>
          <nav aria-label="Mobile">
            <ul className="mobile-menu__links">
              {nav.map((item, i) => (
                <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                  <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined} onClick={() => menu.current?.close()}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mobile-menu__foot">
            {site.availability.open && (
              <p className="status-pill">
                <span className="status-pill__dot" aria-hidden="true" />
                {site.availability.label}
              </p>
            )}
            <div className="cluster">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  menu.current?.close();
                  openAI({ entry: "nav" });
                }}
              >
                Ask Riyad AI
              </button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  menu.current?.close();
                  openPreferences();
                }}
              >
                Display and privacy
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </header>
  );
}
