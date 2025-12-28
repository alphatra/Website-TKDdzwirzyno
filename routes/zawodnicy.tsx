import { Head } from "fresh/runtime";
import { PageProps } from "fresh";
import pb from "../utils/pb.ts";
import { Handlers } from "fresh/compat";
import { Athlete, Result } from "../utils/types.ts";

export const handler: Handlers<Athlete[]> = {
  async GET(ctx) {
    try {
      // 1. Fetch all athletes
      const athletesResult = await pb.collection("athletes").getList<Athlete>(
        1,
        50,
        {
          sort: "name",
        },
      );
      const athletes = athletesResult.items;

      // 2. Fetch all results for these athletes
      const resultsResult = await pb.collection("results").getList<Result>(
        1,
        500,
        {
          sort: "-competition.date",
          expand: "competition",
        },
      );
      const allResults = resultsResult.items;

      // 3. Map results to athletes and calculate stats
      const enrichedAthletes = athletes.map((athlete) => {
        const athleteResults = allResults.filter((r) =>
          r.athlete === athlete.id
        );

        // Calculate stats
        const stats = {
          gold: athleteResults.filter((r) => r.medal === "gold").length,
          silver: athleteResults.filter((r) => r.medal === "silver").length,
          bronze: athleteResults.filter((r) => r.medal === "bronze").length,
        };

        // Get 3 most recent results and sanitize them
        const recentResults = athleteResults
          .sort((a, b) => {
            const dateA = a.expand?.competition?.date
              ? new Date(a.expand.competition.date).getTime()
              : 0;
            const dateB = b.expand?.competition?.date
              ? new Date(b.expand.competition.date).getTime()
              : 0;
            return dateB - dateA;
          })
          .slice(0, 3)
          .map((r) => ({
            id: r.id,
            discipline: r.discipline,
            medal: r.medal,
            place: r.place,
            description: r.description,
            expand: r.expand
              ? {
                competition: {
                  name: r.expand.competition.name,
                  year: r.expand.competition.year,
                  date: r.expand.competition.date,
                  rank: r.expand.competition.rank,
                },
              }
              : undefined,
          }));

        return {
          id: athlete.id,
          name: athlete.name,
          rank: athlete.rank,
          bio: athlete.bio,
          image: athlete.image,
          status: athlete.status,
          collectionId: athlete.collectionId,
          collectionName: athlete.collectionName,
          stats,
          recentResults,
        };
      });

      return ctx.render(enrichedAthletes);
    } catch (e) {
      console.warn("PocketBase Fetch Error (Athletes):", e);
      return ctx.render([]);
    }
  },
};

// --- Main Page Component ---

import AthletesGrid from "../islands/AthletesGrid.tsx";

export default function Zawodnicy({ data }: PageProps<Athlete[]>) {
  // Filter athletes logic
  const activeAthletes = data.filter((a) => a.status !== "alumni");
  const alumniAthletes = data.filter((a) => a.status === "alumni");

  return (
    <>
      <Head>
        <title>Zawodnicy - TKD Dzwirzyno</title>
        <meta
          name="description"
          content="Poznaj naszych zawodników. Ich sukcesy, medale i historia."
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="true"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Orbitron:wght@500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
        <style>
          {`
            .bg-grid {
              background-size: 40px 40px;
              background-image: linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
            }
            .dark .bg-grid {
              background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            }
            
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #cbd5e1;
                border-radius: 20px;
            }
            .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: #334155;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: #94a3b8;
            }

            /* Glow Effects */
            .athlete-card .glow-gold,
            .athlete-card .glow-silver,
            .athlete-card .glow-bronze,
            .athlete-card .glow-icon {
              transition: box-shadow 0.3s ease, filter 0.3s ease, transform 0.3s ease;
            }

            @keyframes glow-pulse-gold {
              0%, 100% { box-shadow: 0 0 15px rgba(234, 179, 8, 0.6); }
              50% { box-shadow: 0 0 25px rgba(234, 179, 8, 0.9); }
            }
            @keyframes glow-pulse-silver {
              0%, 100% { box-shadow: 0 0 15px rgba(148, 163, 184, 0.6); }
              50% { box-shadow: 0 0 25px rgba(148, 163, 184, 0.9); }
            }
            @keyframes glow-pulse-bronze {
              0%, 100% { box-shadow: 0 0 15px rgba(180, 83, 9, 0.6); }
              50% { box-shadow: 0 0 25px rgba(180, 83, 9, 0.9); }
            }
            @keyframes glow-pulse-icon {
              0%, 100% { filter: drop-shadow(0 0 8px rgba(234, 179, 8, 0.8)); transform: scale(1.1); }
              50% { filter: drop-shadow(0 0 15px rgba(234, 179, 8, 1)); transform: scale(1.15); }
            }

            @keyframes status-pulse {
              0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 8px currentColor; }
              50% { opacity: 0.8; transform: scale(1.2); box-shadow: 0 0 12px currentColor; }
            }
            
            .animate-status-pulse {
              animation: status-pulse 2s infinite ease-in-out;
            }

            .athlete-card:hover .glow-gold {
              animation: glow-pulse-gold 2s infinite ease-in-out;
            }
            .athlete-card:hover .glow-silver {
              animation: glow-pulse-silver 2s infinite ease-in-out;
            }
            .athlete-card:hover .glow-bronze {
              animation: glow-pulse-bronze 2s infinite ease-in-out;
            }
            .athlete-card:hover .glow-icon {
              animation: glow-pulse-icon 2s infinite ease-in-out;
            }
          `}
        </style>
      </Head>

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
}
