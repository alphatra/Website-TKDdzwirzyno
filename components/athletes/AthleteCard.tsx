import { Athlete } from "../../utils/types.ts";
import { parseRank } from "../../utils/rank.ts";
import { MedalDisplay } from "./MedalDisplay.tsx";

interface AthleteCardProps {
  athlete: Athlete;
  onClick: (athlete: Athlete) => void;
}

export function AthleteCard({ athlete, onClick }: AthleteCardProps) {
  const { number: rankNumber, type: rankType, rank } = parseRank(athlete.rank);

  // Robust splitting to handle NBSP and multiple spaces
  const parts = athlete.name.trim().split(/[\s\u00A0]+/);
  const firstName = parts[0] || athlete.name;
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "\u00A0"; // Use nbsp to keep line height if empty

  return (
    <button
      type="button"
      onClick={() => onClick(athlete)}
      class="athlete-card group relative text-left w-full h-full flex flex-col justify-start bg-card-light dark:bg-card-dark rounded-3xl p-7 shadow-avant hover:shadow-2xl transition-[transform,box-shadow] duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-700/50 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 motion-reduce:transition-none motion-reduce:transform-none"
    >
      {/* Decorative Elements - Consistent "Ring" with Rank Branding */}
      <div
        class={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700 ${
          athlete.status === "inactive"
            ? "bg-slate-500/5"
            : rankType === "DAN"
            ? "bg-gold/10"
            : "bg-primary/5"
        }`}
      >
      </div>

      {/* Header */}
      <div class="flex justify-between items-start mb-7 relative">
        <div class="flex gap-4 flex-1 min-w-0 pr-2">
          {/* Avatar */}
          <div class="relative shrink-0">
            <div class="w-12 h-12 rounded-full border border-primary/40 p-0.5">
              {athlete.image
                ? (
                  <img
                    src={`/api/files/${athlete.collectionId}/${athlete.id}/${athlete.image}?thumb=100x100`}
                    class="w-full h-full rounded-full object-cover"
                    alt={athlete.name}
                    loading="lazy"
                  />
                )
                : (
                  <div class="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-display font-bold text-sm">
                    {athlete.name.split(" ").map((n) => n[0]).join("")
                      .slice(0, 2)}
                  </div>
                )}
            </div>
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span
                class={`w-2 h-2 rounded-full animate-status-pulse ${
                  athlete.status === "inactive"
                    ? "bg-slate-400 text-slate-400"
                    : athlete.status === "alumni"
                    ? "bg-gold text-gold"
                    : "bg-emerald-500 text-emerald-500"
                }`}
              >
              </span>
              <span class="text-[10px] uppercase tracking-widest text-slate-400 font-semibold truncate">
                {athlete.status === "active" || !athlete.status
                  ? "Aktywny"
                  : athlete.status === "alumni"
                  ? "Legenda"
                  : athlete.status}
              </span>
            </div>
            <h2 class="font-display text-2xl font-bold leading-tight break-words hyphens-auto">
              {firstName}
              <br />
              {lastName}
            </h2>
          </div>
        </div>
        <div class="flex flex-col items-end shrink-0 ml-2">
          {rankType === "DAN"
            ? (
              <div class="dan-badge-custom px-3 py-1 rounded-sm shadow-md">
                <span class="font-display text-sm font-black tracking-widest">
                  {rank}
                </span>
              </div>
            )
            : (
              <>
                <span class="font-display text-3xl font-black text-slate-200 dark:text-slate-700 group-hover:text-primary transition-colors duration-300">
                  {rankNumber}
                </span>
                <span class="text-xs font-bold uppercase tracking-wider text-slate-400">
                  KUP
                </span>
              </>
            )}
        </div>
      </div>

      {/* Medals */}
      <MedalDisplay stats={athlete.stats} variant="bars" />

      {/* Recent Results */}
      <div class="relative">
        <h3 class="font-display text-sm uppercase text-slate-400 mb-4 tracking-wider">
          Ostatnie Wyniki
        </h3>
        <div class="absolute left-1 top-8 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-700">
        </div>

        <div class="space-y-4 relative">
          {!athlete.recentResults ||
              athlete.recentResults.length === 0
            ? (
              <div class="flex items-start pl-6 relative">
                <div class="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white dark:border-slate-800 z-10">
                </div>
                <div class="flex-1">
                  <p class="text-xs text-slate-400 mt-0.5 font-light">
                    Brak ostatnich wyników
                  </p>
                </div>
              </div>
            )
            : (
              athlete.recentResults.slice(0, 2).map(
                (result, idx) => {
                  let medalColor = "bg-slate-300";
                  let medalTextClass =
                    "text-slate-500 bg-slate-100 dark:bg-slate-700";
                  let medalLabel = "Udział";

                  if (result.medal === "gold") {
                    medalColor = "bg-gold";
                    medalTextClass = "text-gold bg-gold/10";
                    medalLabel = "Złoto";
                  } else if (result.medal === "silver") {
                    medalColor = "bg-silver";
                    medalTextClass =
                      "text-slate-500 bg-slate-100 dark:bg-slate-700";
                    medalLabel = "Srebro";
                  } else if (result.medal === "bronze") {
                    medalColor = "bg-bronze";
                    medalTextClass = "text-bronze bg-bronze/10";
                    medalLabel = "Brąz";
                  }

                  return (
                    <div
                      key={idx}
                      class="flex items-start pl-6 relative"
                    >
                      <div
                        class={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${medalColor} border-2 border-white dark:border-slate-800 z-10`}
                      >
                      </div>
                      <div class="flex-1">
                        <div class="flex justify-between items-baseline">
                          <span class="text-xs font-mono text-slate-400">
                            {result.expand?.competition
                              ?.year || "2025"}
                          </span>
                          <span
                            class={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${medalTextClass}`}
                          >
                            {medalLabel}
                          </span>
                        </div>
                        <p class="text-sm font-medium text-slate-700 dark:text-slate-300 leading-snug mt-0.5 line-clamp-1">
                          {result.expand?.competition?.name ||
                            "Zawody"}
                        </p>
                        <p class="text-xs text-slate-400 mt-0.5 font-light">
                          {result.discipline}
                        </p>
                      </div>
                    </div>
                  );
                },
              )
            )}
        </div>
      </div>
    </button>
  );
}
