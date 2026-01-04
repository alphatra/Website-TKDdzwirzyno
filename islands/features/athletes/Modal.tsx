import { useRef } from "preact/hooks";
import { Athlete } from "../../../utils/types.ts";
import { MedalDisplay } from "../../../components/athletes/MedalDisplay.tsx";
import { parseRank } from "../../../utils/rank.ts";
import { useScrollLock } from "../shared/useScrollLock.ts";
import { useFocusTrap } from "../shared/useFocusTrap.ts";
import { useOutsideClick } from "../shared/useOutsideClick.ts";
import Toast from "../../ui/Toast.tsx";
import { useState } from "preact/hooks";

interface AthleteModalProps {
  athlete: Athlete | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AthleteModal(
  { athlete, isOpen, onClose }: AthleteModalProps,
) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null); // Keep this ref for initial focus
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Use custom hooks for robust behavior
  useScrollLock(isOpen);
  useFocusTrap(isOpen, modalRef, onClose, closeButtonRef);

  // Handle Outside Click
  // Handle Outside Click
  const { handlePointerDown, handlePointerUp } = useOutsideClick(
    modalRef,
    onClose,
    isOpen,
  );

  if (!isOpen || !athlete) return null;

  // Group results by competition
  const groupedResults = athlete.recentResults?.reduce((acc, result) => {
    const compId = result.expand?.competition?.id;
    // Fallback key if no competition ID (shouldn't happen with correct DB relation)
    const key = compId || `no-comp-${result.id}`;
    
    if (!acc[key]) {
      acc[key] = {
        competition: result.expand?.competition,
        results: [],
      };
    }
    acc[key].results.push(result);
    return acc;
  }, {} as Record<string, { competition: NonNullable<NonNullable<NonNullable<typeof athlete.recentResults>[0]['expand']>['competition']>; results: NonNullable<typeof athlete.recentResults> }>) || {};

  // Sort groups by date descending (assuming recentResults came sorted, but safety first)
  const sortedGroups = Object.values(groupedResults).sort((a, b) => {
      const dateA = a.competition?.date ? new Date(a.competition.date).getTime() : 0;
      const dateB = b.competition?.date ? new Date(b.competition.date).getTime() : 0;
      // If dates are equal or missing, fallback to year
      if (dateA === dateB) {
         return (b.competition?.year || 0) - (a.competition?.year || 0);
      }
      return dateB - dateA;
  });

  // Derive display values
  const { number: rankNumber, type: rankType } = parseRank(athlete.rank);
  const names = athlete.name.split(" ");
  const firstName = names[0];
  const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

  // Helper to format date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("pl-PL", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div
      aria-modal="true"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      role="dialog"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300" />
      
      <div
        ref={modalRef}
        class="relative w-full max-w-6xl h-[90vh] md:h-[85vh] bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.6)] flex flex-col md:flex-row border border-slate-100 dark:border-slate-800/80 overflow-hidden animate-[fade-in_0.4s_ease-out_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          class="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-slate-800 dark:text-white hover:text-primary hover:bg-white/20 border border-white/20 transition-all duration-300 group"
        >
          <span class="material-icons-round text-xl group-hover:rotate-90 transition-transform duration-300">
            close
          </span>
        </button>

        {/* --- LEFT COLUMN (HERO) --- */}
        <div class="w-full md:w-[45%] lg:w-[40%] bg-slate-900 relative overflow-hidden flex flex-col justify-end p-8 md:p-10 group/hero">
          {/* Background Image */}
          <div class="absolute inset-0 z-0">
            {athlete.image ? (
              <img
                src={`/api/files/${athlete.collectionId}/${athlete.id}/${athlete.image}`}
                alt={athlete.name}
                class="w-full h-full object-cover object-top opacity-60 mix-blend-screen md:mix-blend-normal md:opacity-50 grayscale contrast-125 transition-transform duration-[20s] ease-linear group-hover/hero:scale-110 origin-center"
              />
            ) : (
                <div class="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span class="text-slate-700 font-display text-9xl font-black opacity-20">TKD</span>
                </div>
            )}
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            <div class="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent" />
          </div>

          {/* Glow Effect */}
          <div class="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

          <div class="relative z-10">
            {/* Rank Badge */}
            <div class="mb-6">
              <div class="flex items-baseline -ml-1">
                <span class="font-display text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 select-none leading-none drop-shadow-2xl">
                  {rankNumber}
                </span>
                <span class="font-display text-primary text-xl font-bold tracking-[0.3em] uppercase ml-[-0.2em] mb-4 drop-shadow-lg">
                  {rankType}
                </span>
              </div>
              <div class="h-1 w-12 bg-primary mt-2 rounded-full shadow-[0_0_15px_rgba(255,85,0,0.8)]" />
            </div>

            {/* Name & Status */}
            <div class="mb-8">
              <h2 class="font-display text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tight mb-3 drop-shadow-lg">
                {firstName}<br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                  {lastName}
                </span>
              </h2>
              <div class="flex items-center gap-3">
                <span class="flex h-2.5 w-2.5 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                </span>
                <span class="text-xs font-mono uppercase text-emerald-400 tracking-wider font-semibold drop-shadow-md">
                  Aktywny Zawodnik
                </span>
              </div>
            </div>

            {/* Quote / Bio */}
            {athlete.bio && (
              <div class="mb-10 relative">
                <span class="text-6xl text-primary/40 font-serif absolute -top-8 -left-4 leading-none select-none">“</span>
                <p class="font-body font-light italic text-slate-300 text-lg leading-relaxed relative z-10 pl-2 border-l-2 border-primary/30 line-clamp-4">
                  {athlete.bio}
                </p>
              </div>
            )}
            
            {/* Expanded Stats Grid (Visual Placeholders if data missing, preserving the layout) */}
             <div class="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-slate-700/50 pt-6 backdrop-blur-sm bg-slate-900/30 -mx-4 px-4 rounded-xl">
                <div>
                   <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">Ranga</span>
                   <span class="font-display text-lg font-bold text-white">{athlete.rank}</span>
                </div>
                 <div>
                   <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">Status</span>
                   <span class="font-display text-lg font-bold text-white capitalize">{athlete.status || "Active"}</span>
                </div>
                 {/* 
                     If we had weight/age/tenure, we'd put them here. 
                     For now, let's use Medal Count totals if available in stats? 
                 */}
                  <div>
                   <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">Medale</span>
                   <span class="font-display text-lg font-bold text-white">
                      {(athlete.stats?.gold || 0) + (athlete.stats?.silver || 0) + (athlete.stats?.bronze || 0)}
                   </span>
                </div>
             </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN (TIMELINE) --- */}
        <div class="w-full md:w-[55%] lg:w-[60%] relative bg-white dark:bg-[#0F172A] flex flex-col h-full">
            {/* Header */}
          <div class="sticky top-0 z-20 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 px-8 py-6 flex justify-between items-center">
            <h3 class="font-display text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-3">
              <span class="material-icons-round text-primary">timeline</span> Ścieżka Kariery
            </h3>
            <div class="flex gap-2">
              <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          </div>

          <div class="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-12 space-y-16 pb-12">
            
            {/* Season Summary (Using Stats) */}
            <section>
              <div class="flex items-center justify-between mb-6">
                <span class="text-xs font-mono text-slate-400 uppercase tracking-widest">Podsumowanie</span>
                <span class="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800 mx-4" />
              </div>
              <div class="grid grid-cols-3 gap-3">
                 {/* Gold */}
                <div class="relative group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 overflow-hidden hover:border-gold/30 transition-colors">
                  <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-round text-4xl text-gold">emoji_events</span>
                  </div>
                  <span class="font-display text-3xl font-bold text-slate-900 dark:text-white block mb-1">
                      {String(athlete.stats?.gold || 0).padStart(2, '0')}
                  </span>
                  <span class="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Złoto</span>
                </div>
                
                 {/* Silver */}
                <div class="relative group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 overflow-hidden hover:border-silver/30 transition-colors">
                   <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-round text-4xl text-silver">emoji_events</span>
                  </div>
                   <span class="font-display text-3xl font-bold text-slate-900 dark:text-white block mb-1">
                      {String(athlete.stats?.silver || 0).padStart(2, '0')}
                  </span>
                  <span class="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Srebro</span>
                </div>
                
                 {/* Bronze */}
                <div class="relative group p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700 overflow-hidden hover:border-bronze/30 transition-colors">
                  <div class="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-round text-4xl text-bronze">emoji_events</span>
                  </div>
                  <span class="font-display text-3xl font-bold text-slate-900 dark:text-white block mb-1">
                      {String(athlete.stats?.bronze || 0).padStart(2, '0')}
                  </span>
                  <span class="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Brąz</span>
                </div>
              </div>
            </section>

             {/* Timeline */}
             <section class="relative">
                 <div class="absolute left-[19px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-primary via-slate-200 to-transparent dark:via-slate-700 rounded-full" />
                 <div class="space-y-12">
                    
                     {(!athlete.recentResults || athlete.recentResults.length === 0) && (
                         <div class="pl-12 opacity-50">
                             <p class="text-slate-500">Brak historii startów.</p>
                         </div>
                     )}

                     {sortedGroups.map((group, i) => {
                         const competition = group.competition;
                         // Determine overall visual medal for the timeline dot
                         // If any gold, show gold. If silver, show silver...
                         const hasGold = group.results.some(r => r.medal === 'gold');
                         const hasSilver = group.results.some(r => r.medal === 'silver');
                         const hasBronze = group.results.some(r => r.medal === 'bronze');
                         
                         const dotClass = hasGold 
                            ? 'bg-gold border-slate-200 dark:border-slate-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                            : hasSilver 
                                ? 'bg-silver border-slate-200 dark:border-slate-600'
                                : hasBronze
                                    ? 'bg-bronze border-slate-200 dark:border-slate-600'
                                    : 'bg-slate-900 dark:bg-white border-slate-200 dark:border-slate-600 group-hover:border-primary';

                         return (
                         <div key={i} class="relative pl-12 group">
                             {/* Timeline Dot */}
                             <div class={`absolute left-[11px] top-1.5 w-4 h-4 rounded-full border-[3px] z-10 transition-colors ${dotClass}`} />
                             
                             <div class="group-hover:translate-x-1 transition-transform duration-300">
                                 <span class="text-xs font-mono text-slate-400 mb-1 block">
                                     {formatDate(competition?.date) || competition?.year}
                                 </span>
                                 <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3">
                                     {competition?.name || "Zawody"}
                                 </h4>
                                 
                                 <div class="flex flex-wrap gap-2">
                                     {group.results.map((result, rIdx) => (
                                         <div key={rIdx} class="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-700 shadow-sm transition-colors cursor-default">
                                             <div class={`w-2 h-2 rounded-full ${
                                                  result.medal === 'gold' ? 'bg-gold shadow-[0_0_8px_rgba(234,179,8,0.8)]' :
                                                  result.medal === 'silver' ? 'bg-silver' :
                                                  result.medal === 'bronze' ? 'bg-bronze' : 'bg-slate-400'
                                             }`} />
                                             <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                                {result.medal === "gold" ? "Złoto" : result.medal === "silver" ? "Srebro" : result.medal === "bronze" ? "Brąz" : "Udział"}
                                                <span class="font-normal text-slate-400 ml-1">{result.discipline}</span>
                                             </span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     );
                   })}
                 </div>
             </section>
          </div>
          {/* Removed Footer Actions as requested */}
        </div>

      </div>
    </div>
  );
}
