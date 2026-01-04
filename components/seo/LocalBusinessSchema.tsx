import { Head } from "fresh/runtime";
import { absUrl } from "../../utils/seo.ts";
import { SITE_CONFIG } from "../../utils/siteConfig.ts";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": SITE_CONFIG.name,
    "description": SITE_CONFIG.description,
    "image": absUrl(SITE_CONFIG.ogImage),
    "url": absUrl("/"),
    "telephone": SITE_CONFIG.contact.phone,
    "priceRange": "$", // Keeping generic
    "address": {
      "@type": "PostalAddress",
      "streetAddress": SITE_CONFIG.contact.address.street,
      "addressLocality": SITE_CONFIG.contact.address.city,
      "postalCode": SITE_CONFIG.contact.address.zip,
      "addressCountry": SITE_CONFIG.contact.address.country,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": SITE_CONFIG.contact.geo.lat,
      "longitude": SITE_CONFIG.contact.geo.lng,
    },
    "sameAs": [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.instagram,
    ].filter(Boolean),
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
