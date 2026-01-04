import { ComponentChildren } from "preact";
import { Head } from "fresh/runtime";
import Header from "../../islands/Header.tsx";
import { MenuPageRecord } from "../../utils/pocketbase.ts";
import { Footer } from "./Footer.tsx"; // Import Footer
import { GlobalErrorBoundary } from "../../islands/GlobalErrorBoundary.tsx";

import { absUrl } from "../../utils/seo.ts";
import { LocalBusinessSchema } from "../seo/LocalBusinessSchema.tsx";

interface PageShellProps {
  children: ComponentChildren;
  title?: string;
  description?: string;
  menuPages?: MenuPageRecord[];
  noHeader?: boolean;
  className?: string;
  footer?: ComponentChildren;
  // SEO
  ogImage?: string;
  ogType?: "website" | "article";
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function PageShell({
  children,
  title = "TKD Dźwirzyno",
  description = "Klub Taekwondo Dźwirzyno - Treningi, zawody, pasja.",
  menuPages = [],
  noHeader = false,
  className = "",
  footer,
  ogImage = "/LOGO_TKD_DZWIRZYNO.jpg", // Default logo
  ogType = "website",
  canonicalUrl,
  noIndex = false,
}: PageShellProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={absUrl(ogImage)} />
        {canonicalUrl && (
          <meta property="og:url" content={absUrl(canonicalUrl)} />
        )}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={absUrl(ogImage)} />

        {/* Canonical & Robots */}
        {canonicalUrl && <link rel="canonical" href={absUrl(canonicalUrl)} />}
        {noIndex && (
          <meta name="robots" content="noindex, nofollow, noarchive" />
        )}

        <meta
          name="theme-color"
          content="#ffffff"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0f172a"
          media="(prefers-color-scheme: dark)"
        />
        <LocalBusinessSchema />
      </Head>
      {!noHeader && <Header menuPages={menuPages} />}
      <GlobalErrorBoundary>
        <main
          class={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 animate-page-enter ${className}`}
        >
          {children}
        </main>
        {/* Auto-render footer if not explicitly overridden, or render the override */}
        {footer !== undefined ? footer : <Footer />}
      </GlobalErrorBoundary>
    </>
  );
}
