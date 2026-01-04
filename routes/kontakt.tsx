import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { SiteInfoRecord } from "../utils/pocketbase.ts";
import { SITE_CONFIG } from "../utils/siteConfig.ts";

export default define.page(function Kontakt(props) {
  const { menuPages, siteInfo } = props.state;
  const info = siteInfo as SiteInfoRecord | null;

  const address = info?.address ||
    "Gminne Centrum Sportu i Turystyki\nul. Wyzwolenia 28\n78-131 Dźwirzyno";
  const phone = info?.phone || "+48 123 456 789";
  const email = info?.email || "kontakt@tkddzwirzyno.pl";

  return (
    <PageShell
      title="Kontakt - TKD Dźwirzyno"
      description="Skontaktuj się z nami. Dołącz do treningów w Dźwirzynie."
      menuPages={menuPages}
    >
      <div class="min-h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
        {/* Background Grid & Mesh */}
        <div class="absolute inset-0 bg-grid opacity-[0.4] pointer-events-none" />
        <div class="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div class="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-secondary/10 dark:bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        <div class="container-custom relative z-10 pt-32 pb-20">
          {/* Avant-Garde Header */}
          <header class="mb-16">
            <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-4">
              Kon<span class="text-primary">takt</span>
            </h1>
            <div class="w-16 h-1.5 bg-primary mb-6" />
            <p class="text-lg md:text-xl font-light text-slate-600 dark:text-slate-400 max-w-2xl">
              Masz pytania? Chcesz dołączyć? <br />
              <span class="font-bold text-slate-900 dark:text-white">
                Twoja droga wojownika zaczyna się tutaj.
              </span>
            </p>
          </header>

          <div class="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Contact Details Column */}
            <div class="lg:col-span-5 space-y-10">
              {/* Address Card */}
              <div class="group">
                <h3 class="font-heading text-base text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-3">
                  <span class="w-6 h-[1px] bg-primary" /> Lokalizacja
                </h3>
                <div class="bg-white dark:bg-slate-800/50 backdrop-blur border-l-4 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors duration-300 p-6">
                  <p class="font-display text-xl font-bold text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              {/* Direct Contact Grid */}
              <div class="grid sm:grid-cols-2 gap-8">
                {/* Phone */}
                <div class="group">
                  <h3 class="font-heading text-xs text-slate-400 uppercase tracking-widest mb-2">
                    Telefon
                  </h3>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    class="block font-display text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                  <span class="text-xs text-slate-500 mt-1 block">
                    Trener Główny
                  </span>
                </div>

                {/* Email */}
                <div class="group">
                  <h3 class="font-heading text-xs text-slate-400 uppercase tracking-widest mb-2">
                    Email
                  </h3>
                  <a
                    href={`mailto:${email}`}
                    class="block font-display text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors break-words"
                  >
                    {email}
                  </a>
                  <span class="text-xs text-slate-500 mt-1 block">
                    Odpowiadamy w 24h
                  </span>
                </div>
              </div>

               {/* Training Schedule Teaser / CTA */}
               <div class="bg-primary text-white p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                  <div class="absolute inset-0 bg-slate-900/10 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                  <h3 class="font-display text-xl font-bold mb-2 relative z-10">Pierwszy Trening</h3>
                  <p class="mb-4 opacity-90 relative z-10 text-sm">Przyjdź i sprawdź swoje możliwości za darmo.</p>
                  <div class="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs border-b-2 border-white/30 pb-1 relative z-10">
                    Zobacz grafik <span class="material-icons-round text-sm">arrow_forward</span>
                  </div>
               </div>
            </div>

            {/* Map Column */}
            <div class="lg:col-span-7 h-[500px] lg:h-auto min-h-[500px] relative">
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
          </div>
        </div>
      </div>
    </PageShell>
  );
});
