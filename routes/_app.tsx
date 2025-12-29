import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import "../app.css";

export default define.page(function App({ Component }) {
  return (
    <html lang="pl">
      <head>
        <Head />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="true"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var local = localStorage.getItem('theme');
                var support = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (local === 'dark' || (!local && support)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
