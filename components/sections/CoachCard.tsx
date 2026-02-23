// deno-lint-ignore-file react-no-danger
import { sanitize } from "../../utils/sanitize.ts";
import { Picture } from "../ui/Picture.tsx";
import type { Result } from "../../utils/types.ts";
import type { Result } from "../../utils/types.ts";

export interface Coach {
  id: string;
  name: string;
  role: string;
  rank: string;
  bio: string;
  photo: string;
  collectionId: string;
  collectionName: string;
}

export interface ProcessedCoach extends Coach {
  results: Result[];
}

interface CoachCardProps {
  trainer: ProcessedCoach;
  isEven: boolean;
}

export function CoachCard({ trainer, isEven }: CoachCardProps) {
  const photoUrl = trainer.photo
    ? pb.files.getUrl(trainer, trainer.photo)
    : `https://ui-avatars.com/api/?name=${trainer.name}&size=512&background=334155&color=fff`;

  const cleanBio = sanitize(trainer.bio, "cms");

  return (
    <div class={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-start group perspective-1000`}>
      {/* Image Side - Reduced Width */}
      <div class="w-full lg:w-4/12 relative">
        <div class="relative z-10 aspect-[4/5] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 group-hover:border-primary/50 transition-colors duration-500 shadow-xl dark:shadow-none">
          {trainer.photo ? (
            <Picture
              collectionId={trainer.collectionId}
              recordId={trainer.id}
              filename={trainer.photo}
              thumb="600x0"
              alt={trainer.name}
              class="w-full h-full object-cover grayscale contrast-125 brightness-110 dark:brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          ) : (
            <img 
              src={photoUrl} 
              alt={trainer.name}
              class="w-full h-full object-cover grayscale contrast-125 brightness-110 dark:brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
          )}
          
          {/* Glitch Overlay Effect on Hover */}
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
}
