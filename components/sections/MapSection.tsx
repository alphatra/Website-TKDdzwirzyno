import { SITE_CONFIG } from "../../utils/siteConfig.ts";

export function MapSection() {
  return (
    <div class="lg:col-span-7 h-[500px] lg:h-auto min-h-[500px] relative animate-slide-up delay-100">
      <div class="absolute inset-0 bg-slate-200 dark:bg-slate-800 transform translate-x-4 translate-y-4 lg:translate-x-6 lg:translate-y-6" />
      <div class="absolute inset-0 z-10 border-2 border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 overflow-hidden grayscale hover:grayscale-0 transition-all duration-700">
        <iframe
          src={`https://maps.google.com/maps?q=${SITE_CONFIG.contact.geo.lat},${SITE_CONFIG.contact.geo.lng}&z=15&output=embed`}
          width="100%"
          height="100%"
          style="border:0;"
          loading="lazy"
          allowFullScreen
        >
        </iframe>
      </div>
    </div>
  );
}
