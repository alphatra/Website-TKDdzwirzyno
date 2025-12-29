import sanitizeHtml from "sanitize-html";
import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import pb from "../utils/pb.ts";
import Header from "../islands/Header.tsx";

import type { Result } from "../utils/types.ts";

interface Coach {
  id: string;
  name: string;
  role: string;
  rank: string;
  bio: string;
  photo: string;
  collectionId: string;
  collectionName: string;
}

interface ProcessedCoach extends Coach {
  results: Result[];
}

export default define.page(async function Kadra(props) {
  let processedCoaches: ProcessedCoach[] = [];

  try {
    const coaches = await pb.collection("coaches").getFullList<Coach>({
      sort: "created",
    });

    const results = await pb.collection("results").getFullList<Result>({
      filter: 'coach != ""',
      expand: "competition",
      sort: "-created",
    });

    processedCoaches = coaches.map((c) => {
      const coachResults = results.filter((r) => r.coach === c.id);
      // Sort by year
      coachResults.sort((a, b) =>
        (b.expand?.competition?.year || 0) -
        (a.expand?.competition?.year || 0)
      );
      return { ...c, results: coachResults };
    });
  } catch (e) {
    console.error("PocketBase Fetch Error (Trainers):", e);
    // Fallback or empty state
  }

  const { menuPages } = props.state;

  return (
    <>
      <Head>
        <title>Kadra Trenerska - TKD Dzwirzyno</title>
      </Head>

      <Header menuPages={menuPages} />

      {/* Hero */}
      <section class="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div class="absolute inset-0 bg-[url('/static/dojang_bg.jpg')] bg-cover bg-center opacity-20">
        </div>
        <div class="container-custom relative z-10 text-center">
          <span class="text-secondary font-bold tracking-[0.2em] uppercase text-sm mb-4 block animate-slide-up">
            Mentors & Leaders
          </span>
          <h1 class="text-5xl md:text-7xl font-heading font-black mb-6 animate-slide-up">
            Kadra Trenerska
          </h1>
          <div class="w-24 h-1 bg-gradient-to-r from-secondary to-primary mx-auto mb-8">
          </div>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Doświadczenie, pasja i nieustanny rozwój. Poznaj ludzi, którzy stoją
            za sukcesami naszych zawodników.
          </p>
        </div>
      </section>

      {/* Trainers Grid */}
      <section class="py-24 bg-white relative">
        <div class="container-custom">
          <div class="grid lg:grid-cols-2 gap-16">
            {processedCoaches.map((trainer, idx) => {
              const photoUrl = trainer.photo
                ? pb.files.getUrl(trainer, trainer.photo)
                : `https://ui-avatars.com/api/?name=${trainer.name}&size=512&background=0D8ABC&color=fff`;

              const cleanBio = sanitizeHtml(trainer.bio, {
                allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
                allowedAttributes: {
                    ...sanitizeHtml.defaults.allowedAttributes,
                    'img': ['src', 'alt', 'class']
                }
              });

              return (
              <div key={idx} class="group relative">
                {/* Decorative Elements */}
                <div class="absolute -top-10 -left-10 w-40 h-40 bg-gray-50 rounded-full -z-10 group-hover:scale-150 transition-transform duration-700">
                </div>

                <div class="flex flex-col md:flex-row gap-8 items-start">
                  {/* Photo Column */}
                  <div class="w-full md:w-1/2 relative">
                    <div class="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden shadow-2xl relative">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10">
                      </div>

                      <img
                        src={photoUrl}
                        alt={trainer.name}
                        class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />

                      <div class="absolute bottom-6 left-6 z-20">
                        <span class="bg-secondary text-white text-xs font-bold px-3 py-1 rounded mb-2 inline-block shadow-lg">
                          {trainer.rank}
                        </span>
                        <h2 class="text-2xl font-bold text-white leading-none mt-2">
                          {trainer.name}
                        </h2>
                        <p class="text-gray-300 text-sm mt-1 uppercase tracking-wide">
                          {trainer.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Info Column */}
                  <div class="w-full md:w-1/2 pt-4">
                    <h3 class="text-xl font-heading font-bold text-gray-900 mb-6 border-l-4 border-primary pl-4">
                      O Trenerze
                    </h3>
                    <div
                      class="text-gray-600 leading-relaxed mb-8 text-lg"
                      dangerouslySetInnerHTML={{ __html: cleanBio }}
                    />

                    {trainer.results.length > 0 && (
                      <>
                        <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                          Osiągnięcia
                        </h4>

                        <ul class="space-y-4">
                          {trainer.results.map((res, i) => (
                            <li
                              key={i}
                              class="flex items-start gap-4 group/item"
                            >
                              <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover/item:bg-amber-500 group-hover/item:text-white transition-colors flex-shrink-0">
                                <svg
                                  class="w-5 h-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                  />
                                </svg>
                              </div>
                              <div>
                                <span class="text-gray-900 font-bold block pt-1 group-hover/item:text-primary transition-colors">
                                  {res.description}
                                </span>
                                <span class="text-sm text-gray-400">
                                  {res.expand?.competition?.name}{" "}
                                  {res.expand?.competition?.year}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>
    </>
  );
});
