export function CtaSection() {
  return (
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
                aria-label="Przejdź do formularza kontaktowego, aby zapisać się na zajęcia"
                class="relative px-12 py-5 bg-primary text-white font-heading font-black text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-colors skew-x-[-12deg]"
              >
                 <span class="block skew-x-[12deg]">Zapisz się Teraz</span>
              </a>
           </div>
        </div>
        
         {/* Decorative Lines */}
         <div class="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" aria-hidden="true"></div>
         <div class="absolute bottom-0 left-1/4 w-[1px] h-32 bg-white/20" aria-hidden="true"></div>
         <div class="absolute bottom-0 right-1/4 w-[1px] h-32 bg-white/20" aria-hidden="true"></div>
    </section>
  );
}
