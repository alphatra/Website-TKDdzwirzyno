import { define } from "../utils.ts";
import pb from "../utils/client.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { sanitize } from "../utils/sanitize.ts";

import type { Result } from "../utils/types.ts";

interface Coach {
  id: string;
  name: string;
  role: string;
  rank: string;
  bio: string;
  photo: string;
  collectionId: string;
  collectionName: string;
}

interface ProcessedCoach extends Coach {
  results: Result[];
}

export default define.page(async function KadraPage(props) {
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
    console.error("PocketBase Fetch Error (Trainers):", e);
    // Fallback or empty state
  }

  const { menuPages } = props.state;

  return (
    <PageShell
      title="Kadra Trenerska - TKD Dzwirzyno"
      description="Poznaj naszych trenerów i instruktorów."
      menuPages={menuPages}
      ogImage="/static/logo.png"
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
               {processedCoaches.map((trainer, idx) => {
                  const photoUrl = trainer.photo
                  ? pb.files.getUrl(trainer, trainer.photo)
                  : `https://ui-avatars.com/api/?name=${trainer.name}&size=512&background=334155&color=fff`;
                  
                  const isEven = idx % 2 === 0;
                  const cleanBio = sanitize(trainer.bio, "cms");

                  return (
                     <div key={idx} class={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-start group perspective-1000`}>
                        {/* Image Side - Reduced Width */}
                        <div class="w-full lg:w-4/12 relative">
                           <div class="relative z-10 aspect-[4/5] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 group-hover:border-primary/50 transition-colors duration-500 shadow-xl dark:shadow-none">
                              <img 
                                 src={photoUrl} 
                                 alt={trainer.name}
                                 class="w-full h-full object-cover grayscale contrast-125 brightness-110 dark:brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                              />
                              
                              {/* Glitch Overlay Effect on Hover (Optional/Simple) */}
                              <div class="absolute inset-0 bg-primary/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              
                              <div class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 dark:from-black/90 to-transparent">
                                 <div class="font-mono text-primary text-[10px] tracking-widest uppercase mb-1">{trainer.rank}</div>
                                 <h2 class="font-display text-2xl md:text-3xl text-slate-900 dark:text-white uppercase font-black leading-none">{trainer.name}</h2>
                              </div>
                           </div>
                           
                           {/* Geometric Decoration */}
                           <div class={`absolute top-4 ${isEven ? '-left-4' : '-right-4'} w-full h-full border border-primary/20 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500`}></div>
                        </div>

                        {/* Content Side - Reduced Width */}
                        <div class="w-full lg:w-8/12">
                           <div class="mb-6">
                              <h3 class="font-mono text-xs text-slate-500 uppercase tracking-widest mb-1">Rola w klubie</h3>
                              <p class="text-xl text-slate-900 dark:text-white font-bold">{trainer.role}</p>
                           </div>

                           <div class="prose prose-sm text-slate-600 dark:text-slate-400 font-light mb-8 leading-relaxed">
                              {/* deno-lint-ignore react-no-danger */}
                              <div dangerouslySetInnerHTML={{ __html: cleanBio }} />
                           </div>

                           {trainer.results.length > 0 && (
                              <div class="border-t border-slate-200 dark:border-white/10 pt-6">
                                 <h4 class="font-mono text-[10px] text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span class="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                                    Kluczowe Osiągnięcia
                                 </h4>
                                 <div class="grid sm:grid-cols-2 gap-3">
                                    {trainer.results.map((res, rIdx) => (
                                       <div key={rIdx} class="flex items-start gap-2 group/res hover:bg-slate-100 dark:hover:bg-white/5 p-2 rounded transition-colors">
                                          <span class="text-primary mt-0.5 text-sm">✦</span>
                                          <div>
                                             <div class="text-slate-900 dark:text-white text-sm font-bold leading-tight group-hover/res:text-primary transition-colors">{res.description}</div>
                                             <div class="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
                                                {res.expand?.competition?.name} '{String(res.expand?.competition?.year || '').slice(-2)}
                                             </div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
    </PageShell>
  );
});
