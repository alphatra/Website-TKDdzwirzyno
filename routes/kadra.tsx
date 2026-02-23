import { define } from "../utils.ts";
import pb from "../utils/client.ts";
import { PageShell } from "../components/layout/PageShell.tsx";

import type { Result } from "../utils/types.ts";
import { Coach, ProcessedCoach, CoachCard } from "../components/sections/CoachCard.tsx";
import { PageProps } from "$fresh/server.ts";

export default define.page(async function KadraPage(props: PageProps) {
  let processedCoaches: ProcessedCoach[] = [];

  try {
    const [coaches, results] = await Promise.all([
      pb.collection("coaches").getFullList<Coach>({
        sort: "created",
      }),
      pb.collection("results").getFullList<Result>({
        filter: 'coach != ""',
        expand: "competition",
        sort: "-created",
      }),
    ]);

    processedCoaches = coaches.map((c) => {
      const coachResults = results.filter((r) => r.coach === c.id);
      // Sort by year
      coachResults.sort((a, b) =>
        (b.expand?.competition?.year || 0) -
        (a.expand?.competition?.year || 0)
      );
      return { ...c, results: coachResults };
    });

    // Custom Sort: Kazimierz first
    processedCoaches.sort((a, b) => {
        if (a.name.includes("Kazimierz")) return -1;
        if (b.name.includes("Kazimierz")) return 1;
        return 0;
    });
  } catch (e) {
    console.warn("PocketBase Fetch Error (Trainers):", e instanceof Error ? e.message : String(e));
    // Fallback or empty state
  }

  const { menuPages } = props.state;

  return (
    <PageShell
      title="Kadra Trenerska - TKD Dzwirzyno"
      description="Poznaj naszych trenerów i instruktorów."
      menuPages={menuPages}
      ogImage="/logo.jpg"
      ogType="website"
    >
      <div class="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 selection:bg-primary selection:text-white overflow-hidden relative transition-colors duration-300">
         {/* Background Elements */}
         <div class="fixed inset-0 bg-[url('/static/noise.png')] opacity-[0.03] pointer-events-none z-50 mix-blend-overlay"></div>
         {/* Grid: Dark mode white, Light mode slate */}
         <div class="fixed inset-0 bg-grid-slate-900/[0.05] dark:bg-grid-white/[0.02] pointer-events-none"></div>
         <div class="fixed top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 dark:bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
         
         <div class="container-custom relative z-10 pt-24 pb-16">
            {/* Avant-Garde Header - Reduced Sizes */}
            <header class="mb-16 relative">
               <span class="text-primary font-mono text-xs font-bold tracking-[0.3em] uppercase mb-4 block animate-slide-up">
                  Mentors & Leaders
               </span>
               <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6 animate-slide-up leading-[0.85]">
                  Kadra <br />
                  <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-700 dark:to-slate-800 stroke-slate-900 dark:stroke-white text-outline-slate-900 dark:text-outline-white">Trenerska</span>
               </h1>
               
               <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-light border-l-2 border-primary pl-6 ml-2 animate-slide-up delay-100">
                  Fundament sukcesu. <span class="text-slate-900 dark:text-white font-bold">Wiedza. Doświadczenie. Pasja.</span>
               </p>
            </header>

            {/* Trainers Stack - Reduced Spacing */}
            <div class="space-y-20">
               {processedCoaches.map((trainer, idx) => (
                  <CoachCard key={idx} trainer={trainer} isEven={idx % 2 === 0} />
               ))}
            </div>
         </div>
      </div>
    </PageShell>
  );
});
