interface MedalStats {
  gold?: number;
  silver?: number;
  bronze?: number;
}

interface MedalDisplayProps {
  stats?: MedalStats;
  variant?: "bars" | "grid";
}

export function MedalDisplay({ stats, variant = "bars" }: MedalDisplayProps) {
  const gold = stats?.gold || 0;
  const silver = stats?.silver || 0;
  const bronze = stats?.bronze || 0;
  const total = gold + silver + bronze;

  if (variant === "grid") {
    return (
      <div class="grid grid-cols-2 gap-y-6 gap-x-4 border-t border-slate-700/50 pt-6 backdrop-blur-sm bg-slate-900/30 -mx-4 px-4 rounded-xl">
        <div>
          <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            Złoto
          </span>
          <span class="font-display text-lg font-bold text-white">
            {gold}
          </span>
        </div>
        <div>
          <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            Srebro
          </span>
          <span class="font-display text-lg font-bold text-white">
            {silver}
          </span>
        </div>
        <div>
          <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            Brąz
          </span>
          <span class="font-display text-lg font-bold text-white">
            {bronze}
          </span>
        </div>
        <div>
          <span class="text-[10px] uppercase tracking-[0.2em] text-slate-500 block mb-1">
            Razem
          </span>
          <span class="font-display text-lg font-bold text-white">
            {total}
          </span>
        </div>
      </div>
    );
  }

  // Default "bars" variant (for AthleteCard)
  return (
    <div class="flex justify-between items-end mb-7 pb-5 border-b border-slate-100 dark:border-slate-700/50">
      {/* Gold */}
      <div
        class={`text-center group/medal ${!gold ? "opacity-30 grayscale" : ""}`}
      >
        <div class="flex items-end gap-[2px] h-8 mb-2 justify-center">
          <div
            class={`w-1 rounded-sm transition-all duration-300 ${
              gold > 0 ? "bg-gold/20 h-3 glow-gold" : "bg-slate-300 h-1"
            }`}
          >
          </div>
          {gold > 0 && (
            <div class="w-1 h-6 bg-gold rounded-sm shadow-sm glow-gold"></div>
          )}
          {gold > 4 && (
            <div class="w-1 h-8 bg-gold rounded-sm shadow-sm glow-gold"></div>
          )}
        </div>
        <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
          {String(gold).padStart(2, "0")}
        </span>
        <span class="text-[9px] uppercase tracking-widest text-slate-400">
          Złoto
        </span>
      </div>

      {/* Silver */}
      <div
        class={`text-center group/medal ${
          !silver ? "opacity-30 grayscale" : ""
        }`}
      >
        <div class="flex items-end gap-[2px] h-8 mb-2 justify-center">
          <div
            class={`w-1 rounded-sm transition-all duration-300 ${
              silver > 0 ? "bg-silver/40 h-3 glow-silver" : "bg-slate-300 h-1"
            }`}
          >
          </div>
          {silver > 0 && (
            <div class="w-1 h-6 bg-silver rounded-sm shadow-sm glow-silver">
            </div>
          )}
          {silver > 4 && (
            <div class="w-1 h-8 bg-silver rounded-sm shadow-sm glow-silver">
            </div>
          )}
        </div>
        <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
          {String(silver).padStart(2, "0")}
        </span>
        <span class="text-[9px] uppercase tracking-widest text-slate-400">
          Srebro
        </span>
      </div>

      {/* Bronze */}
      <div
        class={`text-center group/medal ${
          !bronze ? "opacity-30 grayscale" : ""
        }`}
      >
        <div class="flex items-end gap-[2px] h-8 mb-2 justify-center">
          <div
            class={`w-1 rounded-sm transition-all duration-300 ${
              bronze > 0 ? "bg-bronze/40 h-3 glow-bronze" : "bg-slate-300 h-1"
            }`}
          >
          </div>
          {bronze > 0 && (
            <div class="w-1 h-4 bg-bronze rounded-sm shadow-sm glow-bronze">
            </div>
          )}
          {bronze > 4 && (
            <div class="w-1 h-8 bg-bronze rounded-sm shadow-sm glow-bronze">
            </div>
          )}
        </div>
        <span class="block text-xl font-display font-bold text-slate-800 dark:text-white">
          {String(bronze).padStart(2, "0")}
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
          {String(total).padStart(2, "0")}
        </span>
        <span class="text-[9px] uppercase tracking-widest text-slate-400">
          Razem
        </span>
      </div>
    </div>
  );
}
