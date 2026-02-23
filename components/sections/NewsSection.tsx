import { Section } from "../../components/layout/Section.tsx";
import { NewsRecord } from "../../utils/pocketbase.ts";
import { Picture } from "../ui/Picture.tsx";

interface NewsSectionProps {
  news: NewsRecord[];
}

export function NewsSection({ news }: NewsSectionProps) {
  return (
    <Section bg="primary" class="relative py-32 overflow-hidden bg-primary-900">
      {/* Slanted Background */}
      <div class="absolute inset-0 bg-secondary-900 skew-y-3 origin-bottom-right z-0"></div>
      <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] z-0"></div>

      <div class="relative z-10 container-custom">
        <div class="flex flex-col md:flex-row justify-between items-end mb-20">
          <div>
            <span class="text-primary-400 font-mono font-bold tracking-widest uppercase text-sm mb-2 block">
              Najnowsze wydarzenia
            </span>
            <h2 class="text-5xl md:text-7xl font-heading font-black text-white uppercase glitch-hover" data-text="Aktualności">
              Aktualności
            </h2>
          </div>
          <a
            href="/aktualnosci"
            aria-label="Przejdź do archiwum wszystkich aktualności"
            class="hidden md:inline-flex items-center gap-3 text-white font-bold hover:text-primary transition-colors group"
          >
            <span class="uppercase tracking-wider">Archiwum wiadomości</span>
            <div class="w-10 h-10 border border-white/20 flex items-center justify-center rounded-full group-hover:border-primary group-hover:bg-primary transition-all" aria-hidden="true">
               →
            </div>
          </a>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          {news && news.length > 0 ? (
            news.map((item) => (
              <a
                href={`/aktualnosci/${item.id}`}
                key={item.id}
                aria-label={`Czytaj artykuł: ${item.title}`}
                class="group relative block h-[450px] overflow-hidden bg-gray-900 border border-gray-800 hover:border-primary transition-all duration-500"
              >
                 {/* Image */}
                <div class="absolute inset-0 z-0 bg-secondary-800">
                  {item.image
                    ? (
                      <Picture
                        collectionId={item.collectionId}
                        recordId={item.id}
                        filename={item.image}
                        thumb="800x800"
                        alt={`Zdjęcie do aktualności: ${item.title}`}
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                      />
                    )
                    : (
                      <div class="w-full h-full flex items-center justify-center">
                         <span class="text-6xl opacity-10 grayscale" aria-hidden="true">🥋</span>
                      </div>
                    )}
                     <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                </div>

                <div class="absolute inset-0 z-10 p-8 flex flex-col justify-end">
                   <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div class="text-primary font-mono text-xs mb-3 flex items-center gap-2">
                        <span class="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true"></span>
                        {item.created ? new Date(item.created).toLocaleDateString("pl-PL") : ""}
                      </div>
                      <h3 class="text-2xl font-heading font-bold text-white mb-4 leading-tight group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p class="text-gray-300 text-sm line-clamp-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {item.summary}
                      </p>
                      
                      <div class="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wider">
                         <span>Czytaj</span>
                         <span class="transform group-hover:translate-x-2 transition-transform" aria-hidden="true">→</span>
                      </div>
                   </div>
                </div>
              </a>
            ))
          ) : (
            <div class="col-span-3 text-center py-20 text-gray-500 border border-dashed border-gray-800">
               <div class="text-4xl mb-4" aria-hidden="true">📭</div>
              Brak aktualności w tym momencie.
            </div>
          )}
        </div>
        
         <div class="mt-12 text-center md:hidden">
            <a href="/aktualnosci" class="btn btn-outline border-white text-white w-full">Zobacz Archiwum</a>
         </div>
      </div>
    </Section>
  );
}
