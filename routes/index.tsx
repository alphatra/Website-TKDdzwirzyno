import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { Section } from "../components/layout/Section.tsx";
import { NewsRecord } from "../utils/pocketbase.ts";

export default define.page(function Home(props) {
  const data = props.state.news as NewsRecord[] || [];

  return (
    <PageShell
      title="TKD Dzwirzyno - Siła i Charakter"
      description="Klub Taekwondo nad morzem. Trenuj z nami w Dźwirzynie."
      menuPages={props.state.menuPages || []}
      ogImage="/static/bg_hero.jpg"
      ogType="website"
    >
      {/* Hero Section: Ocean & Claw */}
      {
        /* We use manual section for Hero because of custom relative/overflow requirements that might conflict with standard Section container?
          Actually Section supports custom classes. Let's try to use Section or kept it raw if complex.
          The Hero has a LOT of custom logic. Let's wrap it in a Section with container=false or just keep it raw but inside PageShell.
      */
      }
      <section class="relative min-h-screen flex items-center bg-primary-900 text-white overflow-hidden">
        {/* Abstract Claw Background */}
        <div class="absolute inset-0 z-0">
          <div class="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-secondary-600/20 rounded-full blur-3xl">
          </div>
          <div class="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-3xl">
          </div>
          {/* Grid Pattern */}
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30">
          </div>
        </div>

        <div class="container-custom relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div class="animate-slide-up">
            <h1 class="text-6xl md:text-8xl font-heading font-black mb-6 leading-none tracking-tighter">
              TKD <span class="text-secondary block md:inline">DZWIRZYNO</span>
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-300 font-light border-l-4 border-secondary pl-6">
              Kuźnia charakteru nad Bałtykiem. <br />
              Dołącz do elity sportowej.
            </p>
            <div class="flex flex-wrap gap-4">
              <a
                href="/kontakt"
                class="btn bg-secondary hover:bg-secondary-500 text-white font-heading font-bold uppercase tracking-wider text-lg px-10 py-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none transition-all"
              >
                Dołącz Teraz
              </a>
              <a
                href="/zawodnicy"
                class="btn border border-white/20 hover:bg-white/10 text-white font-heading font-bold uppercase tracking-wider text-lg px-10 py-4 backdrop-blur-sm"
              >
                Poznaj Kadrę
              </a>
            </div>
          </div>

          {/* Hero Visual (Placeholder) */}
          <div class="hidden md:flex justify-center animate-fade-in relative">
            <div class="relative w-80 h-96 bg-gradient-to-tr from-secondary to-primary-600 skew-y-6 shadow-2xl rounded-sm flex items-center justify-center">
              <span class="text-9xl">🥋</span>
              <div class="absolute -inset-4 border-2 border-white/20 skew-y-6 -z-10">
              </div>
            </div>
          </div>
        </div>

        {/* Angular Divider */}
        <div class="absolute bottom-0 left-0 right-0 h-24 bg-white clip-path-slant-up">
        </div>
      </section>

      {/* Philosophy Section */}
      <Section bg="white">
        <div class="max-w-4xl mx-auto text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-6 uppercase tracking-tight">
            Więcej niż <span class="text-secondary">Sport</span>
          </h2>
          <p class="text-gray-600 text-lg">
            Trenujemy nie tylko ciało, ale i ducha. Nasza metoda opiera się na
            tradycyjnych wartościach Taekwondo połączonych z nowoczesnym
            treningiem motorycznym.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          {[
            { icon: "💪", title: "Siła", desc: "Zbuduj fizyczną przewagę." },
            {
              icon: "🧠",
              title: "Dyscyplina",
              desc: "Panuj nad swoim umysłem.",
            },
            { icon: "🤝", title: "Szacunek", desc: "Wygrywaj z klasą." },
          ].map((feature, i) => (
            <div
              key={i}
              class="group p-8 border border-gray-100 hover:border-secondary/20 bg-gray-50 hover:bg-white transition-all hover:shadow-xl rounded-sm relative overflow-hidden"
            >
              <div class="absolute top-0 right-0 w-20 h-20 bg-secondary/5 rounded-bl-[4rem] transition-transform group-hover:scale-150">
              </div>
              <div class="text-5xl mb-6 relative z-10">{feature.icon}</div>
              <h3 class="text-2xl font-heading font-bold text-primary-900 mb-3">
                {feature.title}
              </h3>
              <p class="text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* News Section */}
      <Section bg="primary" class="relative">
        {/* Angular Divider Top */}
        <div class="absolute top-0 left-0 right-0 h-24 bg-white clip-path-slant-down">
        </div>

        <div class="relative z-10 pt-12">
          <div class="flex justify-between items-end mb-12 border-b border-primary-800 pb-6">
            <div>
              <span class="text-secondary font-bold tracking-widest uppercase text-sm">
                Blog & Info
              </span>
              <h2 class="text-4xl md:text-5xl font-heading font-bold mt-2">
                Aktualności
              </h2>
            </div>
            <a
              href="/aktualnosci"
              class="text-white hover:text-secondary transition-colors font-bold flex items-center gap-2"
            >
              Archiwum <span class="text-xl">→</span>
            </a>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {data.map((item) => (
              <a
                href={`/aktualnosci/${item.id}`}
                key={item.id}
                class="group bg-primary-800 hover:bg-primary-750 transition-colors rounded-sm overflow-hidden flex flex-col h-full border border-primary-700 hover:border-secondary/50"
              >
                <div class="h-48 bg-primary-700 flex items-center justify-center relative overflow-hidden group-hover:opacity-90 transition-opacity">
                  {item.image
                    ? (
                      <img
                        src={`/api/files/${item.collectionId}/${item.id}/${item.image}`}
                        alt={item.title}
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )
                    : (
                      <span class="text-6xl opacity-20 select-none">
                        🥋
                      </span>
                    )}

                  <div class="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                    News
                  </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                  <div class="text-sm text-gray-400 mb-2 font-mono">
                    {new Date(item.created).toLocaleDateString("pl-PL")}
                  </div>
                  <h3 class="text-xl font-heading font-bold mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p class="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.summary}
                  </p>
                  <span class="text-secondary font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform inline-block">
                    Czytaj dalej →
                  </span>
                </div>
              </a>
            ))}
            {data.length === 0 && (
              <div class="col-span-3 text-center py-12 text-gray-500">
                Brak aktualności. Zajrzyj tu wkrótce!
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* CTA Box */}
      <Section bg="white">
        <div class="bg-gradient-to-r from-secondary-600 to-secondary-500 rounded-2xl p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-20">
          </div>

          <div class="relative z-10">
            <h2 class="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Twoja droga zaczyna się tutaj
            </h2>
            <p class="text-xl text-secondary-100 mb-10 max-w-2xl mx-auto">
              Pierwszy trening jest zawsze darmowy. Przyjdź, zobacz, poczuj
              atmosferę. Nie musisz być wielki, żeby zacząć.
            </p>
            <a
              href="/kontakt"
              class="btn bg-white text-secondary-900 hover:bg-gray-100 text-xl px-12 py-5 font-heading font-bold shadow-lg"
            >
              Zapisz się na trening
            </a>
          </div>
        </div>
      </Section>
    </PageShell>
  );
});
