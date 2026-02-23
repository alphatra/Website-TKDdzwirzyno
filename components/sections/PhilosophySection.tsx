import { Section } from "../../components/layout/Section.tsx";

export function PhilosophySection() {
  return (
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
                <span class="text-outline-dark text-transparent" aria-hidden="true">NIŻ</span> <br />
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
                   <span class="absolute -bottom-4 -right-4 text-9xl font-black text-gray-100 group-hover:text-primary/10 transition-colors duration-500 select-none z-0" aria-hidden="true">
                      0{i + 1}
                   </span>
                  
                  <div class="relative z-10 flex items-start gap-6">
                     <span class="text-5xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110 block" aria-hidden="true">{feature.icon}</span>
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
  );
}
