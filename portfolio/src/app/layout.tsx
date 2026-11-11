import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { RevealObserver, UIProvider } from "@/components/UI";
import { site } from "@/content/site";
import "./globals.css";
import "./chrome.css";
import "./home.css";
import "./pages.css";
import "./ai.css";

const display = localFont({
  src: "./fonts/bricolage.woff2",
  variable: "--ff-display",
  weight: "200 800",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: `${site.name} — Portfolio`,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description: site.description,
    url: "/",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.role}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#060c15" },
    { media: "(prefers-color-scheme: light)", color: "#060c15" },
  ],
};

// Runs before first paint: resolves theme and motion so there is no flash.
const boot = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('ra.theme');d.dataset.theme=(t==='light'||t==='dark')?t:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var m=localStorage.getItem('ra.motion');d.dataset.motion=(m==='reduced'||(m===null&&matchMedia('(prefers-reduced-motion: reduce)').matches))?'reduced':'full';}catch(e){document.documentElement.classList.add('js')}})();`;

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.promise,
  url: site.url,
  email: `mailto:${site.contact.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Sylhet", addressCountry: "BD" },
  sameAs: [site.contact.linkedin, site.contact.github],
  knowsAbout: ["Product management", "Learning technology", "Learning architecture", "eLearning", "UX design", "AI products", "AI workflows", "Design systems"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <UIProvider>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <RevealObserver />
        </UIProvider>
      </body>
    </html>
  );
}
