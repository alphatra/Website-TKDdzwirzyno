import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { SiteInfoRecord } from "../utils/pocketbase.ts";
import { ContactDetails } from "../components/sections/ContactDetails.tsx";
import { MapSection } from "../components/sections/MapSection.tsx";
import { PageProps } from "$fresh/server.ts";

export default define.page(function Kontakt(props: PageProps) {
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
            <ContactDetails address={address} phone={phone} email={email} />

            {/* Map Column */}
            <MapSection />
          </div>
        </div>
      </div>
    </PageShell>
  );
});
