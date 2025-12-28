import { useEffect, useRef } from "preact/hooks";
import { Athlete } from "../utils/types.ts";

interface AthleteModalProps {
  athlete: Athlete | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AthleteModal(
  { athlete, isOpen, onClose }: AthleteModalProps,
) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Handle Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Outside Click
  const handleBackdropClick = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen || !athlete) return null;

  // Derive display values
  const rankNumber = athlete.rank.replace(/\D/g, "");
  const rankType = athlete.rank.includes("DAN") ? "DAN" : "KUP";
  const firstName = athlete.name.split(" ")[0];
  const lastName = athlete.name.split(" ").slice(1).join(" ");
  const totalMedals = (athlete.stats?.gold || 0) +
    (athlete.stats?.silver || 0) + (athlete.stats?.bronze || 0);

  // Status mapping
  const statusMap: Record<string, {
    color: string;
    label: string;
    dotClass: string;
    pingClass: string;
    textClass: string;
  }> = {
    active: {
      color: "emerald",
      label: "Aktywny Zawodnik",
      dotClass: "bg-emerald-500",
      pingClass: "bg-emerald-400",
      textClass: "text-emerald-400",
    },
    alumni: {
      color: "gold",
      label: "Legenda Klubu",
      dotClass: "bg-gold",
      pingClass: "bg-yellow-200",
      textClass: "text-gold",
    },
    inactive: {
      color: "slate",
      label: "Nieaktywny",
      dotClass: "bg-slate-400",
      pingClass: "bg-slate-300",
      textClass: "text-slate-400",
    },
  };

  // Safe fallback for status
  const statusConfig = statusMap[athlete.status] || statusMap.active;

  return (
    <div
      aria-modal="true"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      role="dialog"
      onClick={handleBackdropClick as any}
    >
      <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-md transition-opacity duration-300">
      </div>
      <div
        ref={modalRef}
        class="relative w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.6)] flex flex-col md:flex-row border border-slate-100 dark:border-slate-800/80 overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          class="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-slate-800 dark:text-white hover:text-primary hover:bg-white/20 border border-white/20 transition-all duration-300 group"
        >
          <span class="material-icons-round text-xl group-hover:rotate-90 transition-transform duration-300">
            close
          </span>
        </button>
        {/* Left Column (Hero) */}
        <div class="w-full md:w-[45%] lg:w-[40%] bg-slate-900 relative overflow-hidden flex flex-col justify-end p-8 md:p-10 group/hero">
          <div class="absolute inset-0 z-0">
            {athlete.image
              ? (
                <img
                  src={`/api/files/${athlete.collectionId}/${athlete.id}/${athlete.image}`}
                  alt={athlete.name}
                  class="w-full h-full object-cover object-top opacity-60 mix-blend-screen md:mix-blend-normal md:opacity-50 grayscale contrast-125 transition-transform duration-[20s] ease-linear group-hover/hero:scale-110 origin-center"
                />
              )
              : (
                <div class="w-full h-full bg-slate-800 flex items-center justify-center">
                  <span class="text-slate-700 font-display text-9xl font-black opacity-20">
                    TKD
                  </span>
                </div>
              )}
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-transparent">
            </div>
          </div>
          <div class="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[80px] pointer-events-none mix-blend-screen">
          </div>
          <div class="relative z-10 animate-slide-up">
            <div class="mb-6">
              <div class="flex items-baseline -ml-1">
                <span class="font-display text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 select-none leading-none drop-shadow-2xl">
                  {rankNumber}
                </span>
                <span class="font-display text-primary text-xl font-bold tracking-[0.3em] uppercase ml-[-0.2em] mb-4 drop-shadow-lg">
                  {rankType}
                </span>
              </div>
              <div class="h-1 w-12 bg-primary mt-2 rounded-full shadow-[0_0_15px_rgba(255,85,0,0.8)]">
              </div>
            </div>
            <div class="mb-8">
              <h2 class="font-display text-4xl md:text-5xl font-black text-white leading-[0.9] tracking-tight mb-3 drop-shadow-lg">
                {firstName}
                <br />
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-500">
                  {lastName}
                </span>
              </h2>
              <div class="flex items-center gap-3">
                <span class="flex h-2.5 w-2.5 relative">
                  <span
                    class={`animate-ping absolute inline-flex h-full w-full rounded-full ${statusConfig.pingClass} opacity-75`}
                  >
                  </span>
                  <span
                    class={`relative inline-flex rounded-full h-2.5 w-2.5 ${statusConfig.dotClass} shadow-[0_0_10px_currentColor]`}
                  >
                  </span>
                </span>
                <span
                  class={`text-xs font-mono uppercase ${statusConfig.textClass} tracking-wider font-semibold drop-shadow-md`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
            {/* Quote / Bio */}
            {athlete.bio && (
              <div class="mb-10 relative">
                <span class="text-6xl text-primary/40 font-serif absolute -top-8 -left-4 leading-none select-none">
                  “
                </span>
                <p class="font-body font-light italic text-slate-300 text-lg leading-relaxed relative z-10 pl-2 border-l-2 border-primary/30 line-clamp-4">
                  {athlete.bio}
                </p>
              </div>
            )}

            {/* Stats Grid (Replacing Age/Cat with Medals for now) */}
            <div class="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-slate-700/50 pt-6 backdrop-blur-sm bg-slate-900/30 -mx-4 px-4 rounded-xl">
              <div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                  Złoto
                </span>
                <span class="font-display text-lg font-bold text-white">
                  {athlete.stats?.gold || 0}
                </span>
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                  Srebro
                </span>
                <span class="font-display text-lg font-bold text-white">
                  {athlete.stats?.silver || 0}
                </span>
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                  Brąz
                </span>
                <span class="font-display text-lg font-bold text-white">
                  {athlete.stats?.bronze || 0}
                </span>
              </div>
              <div>
                <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
                  Razem
                </span>
                <span class="font-display text-lg font-bold text-white">
                  {totalMedals}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Timeline) */}
        <div class="w-full md:w-[55%] lg:w-[60%] relative bg-white dark:bg-[#0F172A] flex flex-col h-full">
          <div class="sticky top-0 z-20 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 px-8 py-6 flex justify-between items-center">
            <h3 class="font-display text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-3">
              <span class="material-icons-round text-primary">timeline</span>
              Ostatnie Wyniki
            </h3>
            <div class="flex gap-2">
              <span class="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              </span>
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse">
              </span>
            </div>
          </div>

          <div class="overflow-y-auto custom-scrollbar flex-1 p-8 md:p-12 space-y-16">
            <section class="relative animate-fade-in">
              <div class="absolute left-[19px] top-4 bottom-0 w-[2px] bg-gradient-to-b from-primary via-slate-200 to-transparent dark:via-slate-700 rounded-full">
              </div>
              <div class="space-y-12">
                {(!athlete.recentResults ||
                  athlete.recentResults.length === 0) && (
                  <div class="pl-12">
                    <p class="text-slate-500 italic">
                      Brak zapisanych wyników.
                    </p>
                  </div>
                )}

                {athlete.recentResults?.map((result, idx) => {
                  const isGold = result.medal === "gold";
                  const isSilver = result.medal === "silver";
                  const isBronze = result.medal === "bronze";

                  return (
                    <div
                      key={idx}
                      class="relative pl-12 group hover:-translate-x-1 transition-transform duration-300"
                    >
                      {isGold
                        ? (
                          <div class="absolute left-[11px] top-1.5 w-4 h-4 rounded-full bg-gold border-[3px] border-slate-200 dark:border-slate-800 z-10 shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                          </div>
                        )
                        : (
                          <div class="absolute left-[13px] top-2 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 z-10 group-hover:bg-primary transition-colors">
                          </div>
                        )}

                      <div>
                        <span class="text-xs font-mono text-slate-400 mb-1 block">
                          {result.expand?.competition?.date
                            ? new Date(
                              result.expand?.competition?.date,
                            ).toLocaleDateString("pl-PL", {
                              month: "long",
                              year: "numeric",
                            })
                            : result.expand?.competition?.year || "2025"}
                        </span>
                        <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                          {result.expand?.competition?.name || "Zawody"}
                        </h4>
                        <div class="flex flex-wrap gap-2">
                          <div class="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-sm">
                            <div
                              class={`w-2 h-2 rounded-full ${
                                isGold
                                  ? "bg-gold shadow-[0_0_8px_rgba(234,179,8,0.8)]"
                                  : isSilver
                                  ? "bg-silver"
                                  : isBronze
                                  ? "bg-bronze"
                                  : "bg-slate-400"
                              }`}
                            >
                            </div>
                            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200">
                              {result.medal === "gold"
                                ? "Złoto"
                                : result.medal === "silver"
                                ? "Srebro"
                                : result.medal === "bronze"
                                ? "Brąz"
                                : "Udział"}
                              <span class="font-normal text-slate-400 ml-1">
                                {result.discipline}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div class="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm flex justify-between items-center z-20">
            <button class="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center gap-2">
              <span class="material-icons-round text-base">share</span>
              Udostępnij
            </button>
            <button class="group flex items-center gap-3 pl-6 pr-4 py-2 rounded-full bg-primary/10 hover:bg-primary hover:text-white text-primary transition-all duration-300">
              <span class="text-xs font-bold uppercase tracking-widest">
                Pełna baza
              </span>
              <span class="material-icons-round text-lg group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
