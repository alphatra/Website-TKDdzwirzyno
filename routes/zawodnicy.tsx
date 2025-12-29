import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import pb from "../utils/pb.ts";
import Header from "../islands/Header.tsx";
import AthletesGrid from "../islands/AthletesGrid.tsx";
import { Athlete, EnrichedAthlete, Result } from "../utils/types.ts";

export default define.page(async function Zawodnicy(props) {
  let enrichedAthletes: EnrichedAthlete[] = [];

  try {
    // 1. Fetch all athletes
    const athletes = await pb.collection("athletes").getFullList<Athlete>({
      sort: "name",
    });

    // 2. Fetch all results (Already Sorted by DB)
    const allResults = await pb.collection("results").getFullList<Result>({
      sort: "-competition.date",
      expand: "competition",
    });

    // 3. Map results to athletes
    const resultsByAthlete = new Map<string, Result[]>();
    
    // Group results (Preserves order because we iterate sorted array)
    for (const r of allResults) {
      const athleteId = r.athlete; // Relation is a string ID in Result type now
      if (athleteId) {
           if (!resultsByAthlete.has(athleteId)) {
             resultsByAthlete.set(athleteId, []);
           }
           resultsByAthlete.get(athleteId)!.push(r);
      }
    }

    enrichedAthletes = athletes.map((athlete) => {
      const athleteResults = resultsByAthlete.get(athlete.id) || [];

      // Single-Pass Stats Calculation
      let gold = 0;
      let silver = 0;
      let bronze = 0;

      for (const r of athleteResults) {
        if (r.medal === "gold") gold++;
        else if (r.medal === "silver") silver++;
        else if (r.medal === "bronze") bronze++;
      }

      const stats = { gold, silver, bronze };

      // Results are already sorted from DB and Map insertion
      const recentResults = athleteResults.slice(0, 3);

      return {
        ...athlete,
        stats,
        recentResults,
      };
    });
  } catch (e) {
    console.warn("PocketBase Fetch Error (Athletes):", e);
  }

  // Filter with safe defaults - empty status falls back to active
  const activeAthletes = enrichedAthletes.filter((a) => !a.status || a.status === "active");
  const alumniAthletes = enrichedAthletes.filter((a) => a.status === "alumni");

  const { menuPages } = props.state;

  return (
    <>
      <Head>
        <title>Zawodnicy - TKD Dzwirzyno</title>
        <meta
          name="description"
          content="Poznaj naszych zawodników. Ich sukcesy, medale i historia."
        />
      </Head>

      <Header menuPages={menuPages} />

      <div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-body min-h-screen relative">
          <div class="absolute inset-0 z-0 bg-grid opacity-40 pointer-events-none">
          </div>
          <div class="relative z-10 container mx-auto px-4 py-12 max-w-7xl">
            <header class="mb-16 text-center">
              <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block animate-pulse">
                Team Dźwirzyno
              </span>
              <h1 class="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white">
                Kadra{" "}
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400">
                  Zawodnicza
                </span>
              </h1>
              <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-light text-lg">
                Poznaj historię sukcesów zapisanych w medalach. Minimalizm
                formy, maksymalizm treści.
              </p>
            </header>
            <div class="container mx-auto px-4 z-10 relative">
              <AthletesGrid active={activeAthletes} alumni={alumniAthletes} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
});
