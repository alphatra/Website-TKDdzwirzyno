import { Head } from "fresh/runtime";
import { PageProps } from "fresh";
import pb from "../utils/pb.ts";
import { Handlers } from "fresh/compat";

interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
  icon: string;
}

export const handler: Handlers<Achievement[]> = {
  async GET(ctx) {
    try {
      const result = await pb.collection("achievements").getList<Achievement>(
        1,
        50,
        {
          sort: "-date",
        },
      );
      return ctx.render(result.items);
    } catch (e) {
      console.warn("PocketBase Fetch Error (Achievements):", e);
      return ctx.render([]);
    }
  },
};

export default function Osiagniecia({ data }: PageProps<Achievement[]>) {
  return (
    <>
      <Head>
        <title>Hall of Fame - TKD Dzwirzyno</title>
      </Head>

      {/* Dark Cinematic Background */}
      <div class="fixed inset-0 bg-[#050505] -z-20"></div>
      <div class="fixed inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-[#050505] to-[#050505] -z-10">
      </div>

      {/* Golden Dust Particles (Static CSS representation) */}
      <div class="fixed inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIxIiBmaWxsPSIjRkZEMzAwIi8+PC9zdmc+')] -z-10 animate-fade-in">
      </div>

      <section class="relative py-32 overflow-hidden min-h-screen text-white">
        <div class="container-custom relative z-10">
          {/* Header */}
          <header class="text-center mb-24">
            <div class="inline-block relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-300 blur opacity-30">
              </div>
              <span class="relative text-amber-500 font-bold uppercase tracking-[0.5em] text-sm md:text-base mb-4 block animate-slide-up">
                World Class Excellence
              </span>
            </div>

            <h1 class="text-6xl md:text-8xl font-heading font-black mb-8 leading-none bg-clip-text text-transparent bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-700 drop-shadow-[0_0_15px_rgba(234,179,8,0.3)] animate-slide-up">
              HALL{" "}
              <span class="text-white text-4xl align-middle font-light italic opacity-50 px-2">
                of
              </span>{" "}
              FAME
            </h1>

            <div class="w-full max-w-xs mx-auto h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50 mb-8">
            </div>

            <p class="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Aleja zasłużonych. Miejsce, gdzie pasja zmienia się w legendę, a
              pot w czyste złoto.
            </p>
          </header>

          {/* Achievements Grid */}
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-12 px-4">
            {data.length === 0
              ? (
                <div class="col-span-3 text-center py-20 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                  <p class="text-gray-500 text-lg">
                    Wielkie rzeczy wymagają czasu...
                  </p>
                </div>
              )
              : (
                data.map((item, idx) => (
                  <div key={item.id} class="group relative perspective-1000">
                    {/* Floating Effect Wrapper */}
                    <div class="relative transform transition-all duration-500 group-hover:-translate-y-4 group-hover:rotate-x-2 preserve-3d">
                      {/* Card Body */}
                      <div class="relative bg-gradient-to-b from-gray-900 to-black border border-white/10 p-8 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
                        {/* Metallic Shine Overlay */}
                        <div class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10">
                        </div>

                        {/* Top Laurels / Rank */}
                        <div class="flex justify-between items-start mb-8">
                          <div class="text-6xl filter drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] transform group-hover:scale-110 transition-transform duration-500">
                            {item.icon === "trophy"
                              ? "🏆"
                              : item.icon === "medal"
                              ? "🥇"
                              : "⭐"}
                          </div>
                          <div class="text-amber-500/20 font-heading font-black text-7xl leading-none">
                            {/* Adds leading zero */}
                            {(idx + 1).toString().padStart(2, "0")}
                          </div>
                        </div>

                        {/* Content */}
                        <div class="relative z-20">
                          <div class="inline-block px-3 py-1 border border-amber-500/30 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
                            {new Date(item.date).toLocaleDateString("pl-PL", {
                              year: "numeric",
                            })} Award
                          </div>

                          <h3 class="text-2xl md:text-3xl font-heading font-bold text-white mb-4 group-hover:text-amber-400 transition-colors">
                            {item.title}
                          </h3>

                          <p class="text-gray-400 leading-relaxed font-light border-l-2 border-amber-500/20 pl-4">
                            {item.description}
                          </p>
                        </div>

                        {/* Bottom Glow */}
                        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-600/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity">
                        </div>
                      </div>

                      {/* Reflection/Shadow */}
                      <div class="absolute -bottom-8 left-4 right-4 h-4 bg-amber-500/20 blur-xl rounded-[100%] opacity-0 group-hover:opacity-40 transition-all duration-500">
                      </div>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      </section>

      <style>
        {`
        .rotate-x-2 {
           transform: rotateX(2deg);
        }
        .perspective-1000 {
           perspective: 1000px;
        }
        .preserve-3d {
           transform-style: preserve-3d;
        }
      `}
      </style>
    </>
  );
}
