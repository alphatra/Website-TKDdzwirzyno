import { useEffect, useState } from "preact/hooks";
import { Athlete } from "../utils/types.ts";
import AthleteModal from "./AthleteModal.tsx";
import { parseRank } from "../utils/rank.ts";

interface AthletesGridProps {
  active: Athlete[];
  alumni: Athlete[];
}

function AthleteCard(
  { athlete, onClick }: { athlete: Athlete; onClick: (a: Athlete) => void },
) {
  const { number: rankNumber, type: rankType, rank } = parseRank(athlete.rank);

  const [firstName, ...restName] = athlete.name.split(" ");
  const lastName = restName.join(" ");

  return (
    <button
      type="button"
      onClick={() => onClick(athlete)}
      class="athlete-card group relative text-left w-full bg-card-light dark:bg-card-dark rounded-3xl p-8 shadow-avant hover:shadow-2xl transition-[transform,box-shadow] duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-700/50 overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900 motion-reduce:transition-none motion-reduce:transform-none"
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
      <div class="flex justify-between items-start mb-8 relative">
        <div class="flex gap-4">
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

          <div>
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
              <span class="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                {athlete.status === "active" || !athlete.status
                  ? "Aktywny"
                  : athlete.status === "alumni"
                  ? "Legenda"
                  : athlete.status}
              </span>
            </div>
            <h2 class="font-display text-2xl font-bold leading-tight">
                {firstName}
                <br />
                {lastName}
            </h2>
          </div>
        </div>
        <div class="flex flex-col items-end">
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
      <div class="flex justify-between items-end mb-10 pb-6 border-b border-slate-100 dark:border-slate-700/50">
        {/* Gold */}
        <div
          class={`text-center group/medal ${
            !(athlete.stats?.gold) ? "opacity-30 grayscale" : ""
          }`}
        >
          <div class="flex items-end gap-[2px] h-8 mb-2 justify-center">
            <div
              class={`w-1 rounded-sm transition-all duration-300 ${
                (athlete.stats?.gold || 0) > 0
                  ? "bg-gold/20 h-3 glow-gold"
                  : "bg-slate-300 h-1"
              }`}
            >
            </div>
            {(athlete.stats?.gold || 0) > 0 && (
              <div class="w-1 h-6 bg-gold rounded-sm shadow-sm glow-gold">
              </div>
            )}
            {(athlete.stats?.gold || 0) > 4 && (
              <div class="w-1 h-8 bg-gold rounded-sm shadow-sm glow-gold">
              </div>
            )}
          </div>
          <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
            {String(athlete.stats?.gold || 0).padStart(2, "0")}
          </span>
          <span class="text-[9px] uppercase tracking-widest text-slate-400">
            Złoto
          </span>
        </div>

        {/* Silver */}
        <div
          class={`text-center group/medal ${
            !(athlete.stats?.silver) ? "opacity-30 grayscale" : ""
          }`}
        >
          <div class="flex items-end gap-[2px] h-8 mb-2 justify-center">
            <div
              class={`w-1 rounded-sm transition-all duration-300 ${
                (athlete.stats?.silver || 0) > 0
                  ? "bg-silver/40 h-3 glow-silver"
                  : "bg-slate-300 h-1"
              }`}
            >
            </div>
            {(athlete.stats?.silver || 0) > 0 && (
              <div class="w-1 h-6 bg-silver rounded-sm shadow-sm glow-silver">
              </div>
            )}
            {(athlete.stats?.silver || 0) > 4 && (
              <div class="w-1 h-8 bg-silver rounded-sm shadow-sm glow-silver">
              </div>
            )}
          </div>
          <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
            {String(athlete.stats?.silver || 0).padStart(2, "0")}
          </span>
          <span class="text-[9px] uppercase tracking-widest text-slate-400">
            Srebro
          </span>
        </div>

        {/* Bronze */}
        <div
          class={`text-center group/medal ${
            !(athlete.stats?.bronze) ? "opacity-30 grayscale" : ""
          }`}
        >
          <div class="flex items-end gap-[2px] h-8 mb-2 justify-center">
            <div
              class={`w-1 rounded-sm transition-all duration-300 ${
                (athlete.stats?.bronze || 0) > 0
                  ? "bg-bronze/40 h-3 glow-bronze"
                  : "bg-slate-300 h-1"
              }`}
            >
            </div>
            {(athlete.stats?.bronze || 0) > 0 && (
              <div class="w-1 h-4 bg-bronze rounded-sm shadow-sm glow-bronze">
              </div>
            )}
            {(athlete.stats?.bronze || 0) > 4 && (
              <div class="w-1 h-8 bg-bronze rounded-sm shadow-sm glow-bronze">
              </div>
            )}
          </div>
          <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
            {String(athlete.stats?.bronze || 0).padStart(2, "0")}
          </span>
          <span class="text-[9px] uppercase tracking-widest text-slate-400">
            Brąz
          </span>
        </div>

        {/* Total */}
        <div class="text-center group/medal pl-2">
          <div class="h-8 mb-2 flex items-end justify-center">
            <span class="material-icons-round text-yellow-500 text-3xl glow-icon">
              emoji_events
            </span>
          </div>
          <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
            {String(
              (athlete.stats?.gold || 0) + (athlete.stats?.silver || 0) +
                (athlete.stats?.bronze || 0),
            ).padStart(2, "0")}
          </span>
          <span class="text-[9px] uppercase tracking-widest text-slate-400">
            Razem
          </span>
        </div>
      </div>

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

export default function AthletesGrid({ active, alumni }: AthletesGridProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  // Handle Deep Linking & History Navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const athleteId = params.get("athlete");
      
      if (athleteId) {
        const found = [...active, ...(alumni || [])].find((a) => a.id === athleteId);
        if (found) {
          setSelectedAthlete(found);
        }
      } else {
        setSelectedAthlete(null);
      }
    };

    // Initial check
    handleUrlChange();

    // Listen for back/forward
    window.addEventListener("popstate", handleUrlChange);
    return () => window.removeEventListener("popstate", handleUrlChange);
  }, [active, alumni]);

  const openModal = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    const url = new URL(window.location.href);
    url.searchParams.set("athlete", athlete.id);
    history.pushState({}, "", url.toString());
  };

  const closeModal = () => {
    setSelectedAthlete(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("athlete");
    history.pushState({}, "", url.toString());
  }; return (
    <>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
        {active.map((athlete) => (
          <AthleteCard key={athlete.id} athlete={athlete} onClick={openModal} />
        ))}
      </div>

      {alumni && alumni.length > 0 && (
        <>
          <div class="h-32 w-full"></div>
          <div class="pt-16 border-t border-slate-200 dark:border-slate-800">
            <header class="mb-24 text-center">
              <span class="text-yellow-500 text-sm font-bold tracking-[0.3em] uppercase mb-4 block opacity-90 font-display animate-pulse">
                Legendy Klubu
              </span>
              <h2 class="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 text-slate-900 dark:text-white">
                Aleja{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(to right, #FDE68A, #EAB308, #D97706)",
                    "-webkit-background-clip": "text",
                    "background-clip": "text",
                    color: "transparent",
                  }}
                  class="drop-shadow-sm pb-2"
                >
                  Gwiazd
                </span>
              </h2>
              <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light text-lg">
                Zawodnicy, którzy zapisali się w historii naszych startów.
              </p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
              {alumni.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  onClick={openModal}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <AthleteModal
        athlete={selectedAthlete}
        isOpen={!!selectedAthlete}
        onClose={closeModal}
      />
    </>
  );
}
