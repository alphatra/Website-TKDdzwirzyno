import { useEffect, useState } from "preact/hooks";
import { Athlete } from "../../../utils/types.ts";
import AthleteModal from "./Modal.tsx";

interface AthletesGridProps {
  active: Athlete[];
  alumni: Athlete[];
}

import { AthleteCard } from "../../../components/athletes/AthleteCard.tsx";

export default function AthletesGrid({ active, alumni }: AthletesGridProps) {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);

  // Handle Deep Linking & History Navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(globalThis.location.search);
      const athleteId = params.get("athlete");

      if (athleteId) {
        const found = [...active, ...(alumni || [])].find((a) =>
          a.id === athleteId
        );
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
    globalThis.addEventListener("popstate", handleUrlChange);
    return () => globalThis.removeEventListener("popstate", handleUrlChange);
  }, [active, alumni]);

  const openModal = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    const url = new URL(globalThis.location.href);
    url.searchParams.set("athlete", athlete.id);
    history.pushState({}, "", url.toString());
  };

  const closeModal = () => {
    setSelectedAthlete(null);
    const url = new URL(globalThis.location.href);
    url.searchParams.delete("athlete");
    history.replaceState({}, "", url.toString());
  };

  return (
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
