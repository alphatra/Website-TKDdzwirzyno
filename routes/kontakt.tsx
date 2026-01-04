import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { SiteInfoRecord } from "../utils/pocketbase.ts";

export default define.page(function Kontakt(props) {
  const { menuPages, siteInfo } = props.state;
  // Cast siteInfo to SiteInfoRecord safely if needed, though middleware types should handle it in app state ideally.
  // We'll treat it as SiteInfoRecord | null
  const info = siteInfo as SiteInfoRecord | null;

  const address = info?.address ||
    "Gminne Centrum Sportu i Turystyki\nul. Wyzwolenia 28\n78-131 Dźwirzyno";
  const phone = info?.phone || "+48 123 456 789";
  const email = info?.email || "kontakt@tkddzwirzyno.pl";

  return (
    <PageShell
      title="Kontakt - TKD Dzwirzyno"
      description="Skontaktuj się z nami. Dołącz do treningów w Dźwirzynie."
      menuPages={menuPages}
    >
      <div class="min-h-screen bg-white dark:bg-background-dark text-slate-900 dark:text-slate-100 relative overflow-hidden">
        {/* Helper Gradient */}
        <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div class="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] bg-primary/5 rounded-full blur-[100px] dark:bg-primary/10" />
          <div class="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[100px] dark:bg-secondary/10" />
        </div>

        {/* Hero Section */}
        <section class="relative pt-32 pb-20 px-4 z-10">
          <div class="container-custom text-center">
            <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-4 block animate-slide-up">
              Lokalizacja & Kontakt
            </span>
            <h1 class="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 animate-slide-up animation-delay-100">
              Trenuj z{" "}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Nami
              </span>
            </h1>
            <p class="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light animate-slide-up animation-delay-200">
              Zapraszamy na treningi do naszej sali w Gminnym Ośrodku Sportu i
              Rekreacji.
            </p>
          </div>
        </section>

        {/* Contact Grid */}
        <section class="relative pb-32 px-4 z-10">
          <div class="container-custom">
            <div class="grid lg:grid-cols-2 gap-12 xl:gap-20 items-stretch">
              {/* Info Card */}
              <div class="bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 flex flex-col justify-center space-y-12 shadow-xl">
                {/* Address */}
                <div class="flex items-start gap-6 group">
                  <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <span class="material-icons-round text-3xl">
                      location_on
                    </span>
                  </div>
                  <div>
                    <h3 class="font-heading text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Adres
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                      {address}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div class="flex items-start gap-6 group">
                  <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <span class="material-icons-round text-3xl">phone</span>
                  </div>
                  <div>
                    <h3 class="font-heading text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Telefon
                    </h3>
                    <p class="text-slate-600 dark:text-slate-400 mb-2">
                      Trener Główny
                    </p>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      class="text-xl font-bold hover:text-primary transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div class="flex items-start gap-6 group">
                  <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <span class="material-icons-round text-3xl">email</span>
                  </div>
                  <div>
                    <h3 class="font-heading text-xl font-bold mb-2 text-slate-900 dark:text-white">
                      Email
                    </h3>
                    <a
                      href={`mailto:${email}`}
                      class="text-lg hover:text-primary transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div class="relative min-h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2360.596637841347!2d15.41444431585888!3d54.15222218015794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465494a5c5555555%3A0x5555555555555555!2sGminne%20Centrum%20Sportu%20i%20Turystyki!5e0!3m2!1spl!2spl!4v1620000000000!5m2!1spl!2spl"
                  width="100%"
                  height="100%"
                  style="border:0; filter: grayscale(1) contrast(1.2) opacity(0.9);"
                  loading="lazy"
                  allowFullScreen
                >
                </iframe>
                {/* Overlay for interaction hint if needed or style matching */}
                <div class="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.1)]">
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
});
