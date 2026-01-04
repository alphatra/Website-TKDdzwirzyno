import { Head } from "fresh/runtime";
import { absUrl } from "../../utils/seo.ts";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": "TKD Dźwirzyno",
    "description":
      "Klub Taekwondo nad morzem. Trenuj z nami w Dźwirzynie. Siła, charakter, dyscyplina.",
    "image": absUrl("/logo.png"),
    "url": absUrl("/"),
    "telephone": "+48 000 000 000", // TODO: Update with real phone number
    "priceRange": "$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Wyzwolenia", // Keeping generic if exact unknown
      "addressLocality": "Dźwirzyno",
      "postalCode": "78-131",
      "addressCountry": "PL",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 54.15,
      "longitude": 15.41,
    },
    "sameAs": [
      "https://www.facebook.com/tkddzwirzyno",
      "https://www.instagram.com/tkddzwirzyno",
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
}
