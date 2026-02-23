import ParallaxBackground from "../../islands/ui/ParallaxBackground.tsx";
import { Picture } from "../ui/Picture.tsx";

export function HeroSection() {
  return (
    <section class="relative min-h-[95vh] flex items-center bg-secondary-900 text-white overflow-hidden">
      {/* Abstract Dynamic Background */}
      <div class="absolute inset-0 z-0 select-none pointer-events-none">
         {/* Massive Background Text */}
         <div class="absolute -top-20 -left-20 text-[20rem] font-heading font-black text-white/5 opacity-50 z-0 leading-none tracking-tighter mix-blend-overlay hidden md:block overflow-hidden">
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
            <span class="block text-outline opacity-80 absolute -top-1 left-1 md:-top-2 md:left-2 w-full h-full -z-10" aria-hidden="true">TKD</span>
            <span class="block text-white">TKD</span>
            <span class="block text-primary">Dźwirzyno</span>
          </h1>

          <p class="text-xl md:text-2xl mb-10 text-gray-200 font-light max-w-xl border-l-[6px] border-primary pl-6 ml-2 mt-6">
            Kuźnia charakteru. <br />
            <span class="text-white font-bold">Siła. Technika. Pasja.</span>
          </p>

          <div class="flex flex-col md:flex-row gap-5">
            <a
              href="/kontakt"
              aria-label="Dołącz do nas i zapisz się na treningi"
              class="group relative px-8 py-4 bg-white text-secondary-900 font-heading font-black uppercase tracking-wider text-lg transition-all hover:bg-primary hover:text-white skew-x-[-10deg] inline-block text-center"
            >
              <div class="skew-x-[10deg]">Dołącz do nas</div>
              <div class="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 -z-10 transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            </a>
            <a
              href="/zawodnicy"
               aria-label="Zobacz naszą kadrę zawodniczą i trenerów"
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
             <Picture
               src="/Zespol.jpg"
               alt="Zespół TKD Dźwirzyno - taekwon-do ITF"
               class="absolute inset-0 w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700 ease-out scale-105 group-hover:scale-110"
               loading="eager"
             />
             <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
             
             <div class="absolute bottom-8 left-8 right-8">
               <div class="text-6xl text-white/10 font-black absolute -top-12 -left-4 font-heading" aria-hidden="true">ITF</div>
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
  );
}
