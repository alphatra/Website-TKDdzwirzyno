import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { Section } from "../components/layout/Section.tsx";
import ParallaxBackground from "../islands/ui/ParallaxBackground.tsx";
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
      <section class="relative min-h-[95vh] flex items-center bg-secondary-900 text-white overflow-hidden">
        {/* Abstract Dynamic Background */}
        <div class="absolute inset-0 z-0 select-none pointer-events-none">
           {/* Massive Background Text */}
           <div class="absolute -top-20 -left-20 text-[20rem] font-heading font-black text-white/5 opacity-50 z-0 leading-none tracking-tighter mix-blend-overlay hidden md:block">
            TAEKWON-DO
          </div>
          
          <ParallaxBackground speed={0.2} className="w-full h-full">
            <div class="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-primary-600/30 rounded-full blur-[120px] mix-blend-screen">
            </div>
             <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-600/40 rounded-full blur-[100px] mix-blend-screen">
            </div>
          </ParallaxBackground>
          
          {/* Noise/Grain Overlay */}
          <div class="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

           {/* Grid Pattern */}
           <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20">
          </div>
        </div>

        <div class="container-custom relative z-10 grid md:grid-cols-12 gap-8 items-center h-full pt-20">
          {/* Text Content - Spanning 7 cols */}
          <div class="md:col-span-7 flex flex-col justify-center animate-slide-up">
            <div class="inline-flex items-center gap-2 mb-6">
               <span class="h-[2px] w-12 bg-primary"></span>
               <span class="text-primary font-mono text-sm uppercase tracking-[0.3em]">Since 2010</span>
            </div>
            
            <h1 class="text-7xl md:text-9xl font-heading font-black mb-2 leading-[0.85] tracking-tighter uppercase relative">
              <span class="block text-outline opacity-50 absolute -top-1 left-1 md:-top-2 md:left-2 w-full h-full -z-10" aria-hidden="true">TKD</span>
              <span class="block text-white">TKD</span>
              <span class="block text-primary">Dźwirzyno</span>
            </h1>

            <p class="text-xl md:text-2xl mb-10 text-gray-400 font-light max-w-xl border-l-[6px] border-primary pl-6 ml-2 mt-6">
              Kuźnia charakteru. <br />
              <span class="text-white font-bold">Siła. Technika. Pasja.</span>
            </p>

            <div class="flex flex-col md:flex-row gap-5">
              <a
                href="/kontakt"
                class="group relative px-8 py-4 bg-white text-secondary-900 font-heading font-black uppercase tracking-wider text-lg transition-all hover:bg-primary hover:text-white skew-x-[-10deg] inline-block text-center"
              >
                <div class="skew-x-[10deg]">Dołącz do nas</div>
                <div class="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
              </a>
              <a
                href="/zawodnicy"
                 class="group relative px-8 py-4 border border-white/30 text-white font-heading font-bold uppercase tracking-wider text-lg transition-all hover:border-primary hover:text-primary skew-x-[-10deg] inline-block text-center backdrop-blur-sm"
              >
                 <div class="skew-x-[10deg]">Nasza Kadra</div>
              </a>
            </div>
          </div>

           {/* Visual Content - Spanning 5 cols */}
          <div class="md:col-span-5 hidden md:flex justify-end items-center relative h-full">
            {/* Geometric Decorations */}
            <div class="absolute top-10 right-0 w-64 h-64 border-[20px] border-secondary-800 rounded-full z-0 opacity-50"></div>
            <div class="absolute bottom-20 left-10 w-32 h-32 bg-primary mix-blend-multiply rounded-full blur-2xl animate-pulse"></div>

            <div class="relative z-10 w-full aspect-[4/5] bg-gradient-to-br from-gray-800 to-black skew-x-[-6deg] shadow-2xl border-t border-l border-white/10 overflow-hidden group">
               {/* Image Placeholder or Actual Hero Image */}
               <div class="absolute inset-0 bg-[url('/static/logo.jpg')] bg-cover bg-center grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-110"></div>
               <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
               
               <div class="absolute bottom-8 left-8 right-8">
                 <div class="text-6xl text-white/10 font-black absolute -top-12 -left-4 font-heading">ITF</div>
                 <div class="text-white font-heading font-bold text-2xl relative z-10">
                   Taekwon-do ITF
                 </div>
                 <div class="w-12 h-1 bg-primary mt-2"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Angled Cut */}
        <div class="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-white clip-path-slant-reverse translate-y-1">
        </div>
      </section>

      {/* Philosophy Section */}
      <Section bg="white" class="relative overflow-hidden py-32">
        {/* Background Decorations */}
        <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-y-1/2 -translate-x-1/3"></div>

        <div class="max-w-6xl mx-auto px-4 relative z-10">
          <div class="grid md:grid-cols-12 gap-12 items-start">
             {/* Text Side */}
             <div class="md:col-span-5 sticky top-20">
                <h2 class="text-6xl md:text-8xl font-heading font-black text-secondary-900 mb-8 leading-[0.8]">
                  WIĘCEJ <br /> 
                  <span class="text-outline-dark text-transparent">NIŻ</span> <br />
                  <span class="text-primary italic">SPORT</span>
                </h2>
                <div class="w-24 h-2 bg-secondary-900 mb-8"></div>
                <p class="text-gray-600 text-lg md:text-xl leading-relaxed">
                  Trenujemy nie tylko ciało, ale i ducha. Nasza metoda opiera się na
                  tradycyjnych wartościach Taekwondo połączonych z nowoczesnym
                  treningiem motorycznym.
                </p>
             </div>

             {/* Cards Side - Staggered Grid */}
             <div class="md:col-span-7 grid gap-8">
               {[
                  { icon: "💪", title: "Siła", desc: "Zbuduj fizyczną przewagę." },
                  { icon: "🧠", title: "Dyscyplina", desc: "Panuj nad swoim umysłem." },
                  { icon: "🤝", title: "Szacunek", desc: "Wygrywaj z klasą." },
                ].map((feature, i) => (
                  <div
                    key={i}
                    class={`group p-10 bg-white border-l-4 border-secondary hover:border-primary transition-all shadow-xl hover:shadow-2xl relative overflow-hidden ${
                         i % 2 === 0 ? "md:mr-12" : "md:ml-12"
                    }`}
                  >
                    <div class="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                     {/* Big Number Background */}
                     <span class="absolute -bottom-4 -right-4 text-9xl font-black text-gray-100 group-hover:text-primary/10 transition-colors duration-500 select-none z-0">
                        0{i + 1}
                     </span>
                    
                    <div class="relative z-10 flex items-start gap-6">
                       <span class="text-5xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 block">{feature.icon}</span>
                       <div>
                          <h3 class="text-3xl font-heading font-bold text-secondary-900 mb-2 uppercase group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p class="text-gray-500 font-medium">{feature.desc}</p>
                       </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </Section>

      {/* News Section */}
      <Section bg="primary" class="relative py-32 overflow-hidden bg-primary-900">
        {/* Slanted Background */}
        <div class="absolute inset-0 bg-secondary-900 skew-y-3 origin-bottom-right z-0"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] z-0"></div>

        <div class="relative z-10 container-custom">
          <div class="flex flex-col md:flex-row justify-between items-end mb-20">
            <div>
              <span class="text-primary-400 font-mono font-bold tracking-widest uppercase text-sm mb-2 block">
                Latest Updates
              </span>
              <h2 class="text-5xl md:text-7xl font-heading font-black text-white uppercase glitch-hover" data-text="Aktualności">
                Aktualności
              </h2>
            </div>
            <a
              href="/aktualnosci"
              class="hidden md:inline-flex items-center gap-3 text-white font-bold hover:text-primary transition-colors group"
            >
              <span class="uppercase tracking-wider">Archiwum wiadomości</span>
              <div class="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full group-hover:border-primary group-hover:bg-primary transition-all">
                 →
              </div>
            </a>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            {data.map((item, index) => (
              <a
                href={`/aktualnosci/${item.id}`}
                key={item.id}
                class="group relative block h-[450px] overflow-hidden bg-gray-900 border border-gray-800 hover:border-primary transition-all duration-500"
              >
                 {/* Image */}
                <div class="absolute inset-0 z-0">
                  {item.image
                    ? (
                      <img
                        src={`/api/files/${item.collectionId}/${item.id}/${item.image}`}
                        alt={item.title}
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                        loading="lazy"
                      />
                    )
                    : (
                      <div class="w-full h-full bg-secondary-800 flex items-center justify-center">
                         <span class="text-6xl opacity-10 grayscale">🥋</span>
                      </div>
                    )}
                     <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>

                <div class="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                   <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div class="text-primary font-mono text-xs mb-3 flex items-center gap-2">
                        <span class="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        {new Date(item.created).toLocaleDateString("pl-PL")}
                      </div>
                      <h3 class="text-2xl font-heading font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p class="text-gray-400 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {item.summary}
                      </p>
                      
                      <div class="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                         <span>Czytaj</span>
                         <span class="transform group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                   </div>
                </div>
              </a>
            ))}
            {data.length === 0 && (
              <div class="col-span-3 text-center py-20 text-gray-500 border border-dashed border-gray-800">
                 <div class="text-4xl mb-4">📭</div>
                Brak aktualności.
              </div>
            )}
          </div>
          
           <div class="mt-12 text-center md:hidden">
              <a href="/aktualnosci" class="btn btn-outline border-white text-white w-full">Zobacz Archiwum</a>
           </div>
        </div>
      </Section>

      {/* CTA Section */}
      <section class="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-secondary-900 group">
          {/* Parallax Background using pseudo-elements or absolute divs since we want it simple/bold */}
          <div class="absolute inset-0 bg-[url('/static/logo.jpg')] bg-cover bg-center opacity-30 grayscale transition-transform duration-[3s] group-hover:scale-110"></div>
          <div class="absolute inset-0 bg-gradient-to-r from-secondary-900 via-secondary-900/80 to-primary-900/80"></div>
          
          <div class="relative z-10 container-custom text-center">
             <div class="inline-block border text-white/50 border-white/20 px-4 py-1 rounded-full text-sm uppercase tracking-widest mb-6 backdrop-blur-sm">
                Join the Elite
             </div>
             
             <h2 class="text-6xl md:text-9xl font-heading font-black text-white mb-8 uppercase leading-none tracking-tighter">
               Zacznij <br />
               <span class="text-primary glitch-hover" data-text="DZISIAJ">DZISIAJ</span>
             </h2>
             
             <p class="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                Pierwszy trening to Twój pierwszy krok do mistrzostwa. 
                <span class="block mt-2 text-white font-bold">Reszta zależy od Ciebie.</span>
             </p>
             
             <div class="flex flex-col md:flex-row justify-center gap-6">
                <a
                  href="/kontakt"
                  class="relative px-12 py-5 bg-primary text-white font-heading font-black text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-colors skew-x-[-12deg]"
                >
                   <span class="block skew-x-[12deg]">Zapisz się Teraz</span>
                </a>
             </div>
          </div>
          
           {/* Decorative Lines */}
           <div class="absolute bottom-0 left-0 w-full h-[1px] bg-white/20"></div>
           <div class="absolute bottom-0 left-1/4 w-[1px] h-32 bg-white/20"></div>
           <div class="absolute bottom-0 right-1/4 w-[1px] h-32 bg-white/20"></div>
      </section>
    </PageShell>
  );
});
