import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";

// deno-lint-ignore no-explicit-any
export default define.page(function Error404Page(props: any) {
  return (
    <PageShell
      title="404 - Strona nie znaleziona | TKD Dźwirzyno"
      description="Podany adres nie istnieje w serwisie."
      menuPages={props.state?.menuPages || []}
      noIndex
    >
      <section class="min-h-[85vh] flex items-center justify-center bg-secondary-900 text-white relative overflow-hidden">
        {/* Abstract Backgrounds */}
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05]"></div>
          <div class="absolute inset-0 bg-gradient-to-br from-secondary-900 to-black mix-blend-multiply"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/20 rounded-full blur-[100px] mix-blend-screen opacity-50"></div>
        </div>
        
        <div class="container-custom relative z-10 text-center max-w-3xl mx-auto px-4 pt-20">
          {/* Big Background 404 Text */}
          <div class="text-[12rem] md:text-[20rem] font-heading font-black leading-none text-white/5 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] z-0 whitespace-nowrap overflow-hidden" aria-hidden="true">
            404
          </div>
          
          <div class="relative z-10 animate-slide-up">
            <span class="text-7xl mb-8 block grayscale opacity-80" aria-hidden="true">🥋</span>
            <h1 class="text-5xl md:text-7xl font-heading font-black mb-6 uppercase tracking-tighter text-white">
              Cios <span class="text-primary italic">Pudłuje!</span>
            </h1>
            
            <p class="text-xl md:text-2xl text-gray-400 mb-12 font-light border-l-4 border-primary pl-6 inline-block text-left max-w-xl">
              Próbowaliśmy przechwycić tę stronę, ale <br/>
              <span class="text-white font-bold">zrobiła unik i nie istnieje.</span>
            </p>
            
            <div class="flex justify-center">
              <a
                href="/"
                aria-label="Wróć na stronę główną"
                class="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-secondary-900 font-heading font-black uppercase tracking-widest text-lg transition-all hover:bg-primary hover:text-white skew-x-[-10deg]"
              >
                <div class="skew-x-[10deg] flex items-center gap-3">
                  <span>← Powrót na Dojang</span>
                </div>
                <div class="absolute inset-0 border-2 border-white translate-x-1.5 translate-y-1.5 -z-10 transition-transform group-hover:translate-x-2.5 group-hover:translate-y-2.5"></div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
});
