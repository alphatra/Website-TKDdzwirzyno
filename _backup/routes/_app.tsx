/** @jsxImportSource preact */
import { type PageProps } from "fresh";
import Header from "../islands/Header.tsx";
import Footer from "../components/Footer.tsx";

import "../static/input.css";

export default function App(props: PageProps) {
  const { Component, state } = props;
  // state populated by _middleware.ts
  const siteInfo = state?.siteInfo;
  const menuPages = (state?.menuPages || []) as any[]; // Dynamic menu items

  return (
    <html lang="pl" class="bg-gray-900 dark no-transition">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>TKD Dzwirzyno - Klub Taekwondo</title>
        <link rel="stylesheet" href="/styles.css?v=5" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <meta
          name="description"
          content="Klub sportowy Taekwondo w Dzwirzyno. Treningi dla dzieci i młodzieży. Rozwijamy pasję, dyscyplinę i charakter."
        />
        <style
          dangerouslySetInnerHTML={{
            __html: ".no-transition * { transition: none !important; }",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.addEventListener('load', function() {
            requestAnimationFrame(function() {
              document.documentElement.classList.remove('no-transition');
            });
          });
        `,
          }}
        />
      </head>
      <body class="bg-gray-900 text-slate-800">
        <Header menuPages={menuPages} />
        <main class="min-h-screen">
          <Component {...(props as any)} />
        </main>
        <Footer siteInfo={siteInfo} />
      </body>
    </html>
  );
}
