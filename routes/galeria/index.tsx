import { define } from "../../utils.ts";
import pb from "../../utils/pb.ts";
import { PageShell } from "../../components/layout/PageShell.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";

interface Album {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  cover: string;
  collectionId: string;
}

export default define.page(async function Gallery(props) {
  let albums: Album[] = [];
  try {
    const records = await pb.collection("albums").getList<Album>(1, 50, {
      sort: "-date",
    });
    albums = records.items;
  } catch (error) {
    console.error("Error fetching albums:", error);
  }

  const { menuPages } = props.state;

  return (
    <PageShell
      title="Galeria - TKD Dzwirzyno"
      description="Zdjęcia z zawodów, treningów i życia klubu."
      menuPages={menuPages}
      ogImage="/static/bg_hero.jpg"
      ogType="website"
    >
      <div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-body min-h-screen relative">
          <div class="absolute inset-0 z-0 bg-grid opacity-40 pointer-events-none">
          </div>

          {/* Hero Section */}
          <div class="relative z-10 bg-slate-900 text-white py-20 pb-32 overflow-hidden">
            <div class="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]">
            </div>
            <div class="container mx-auto px-4 z-10 relative text-center">
              <span class="text-primary text-xs font-bold tracking-[0.2em] uppercase mb-3 block animate-pulse">
                Wspomnienia
              </span>
              <h1 class="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
                Galeria{" "}
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Wydarzeń
                </span>
              </h1>
              <p class="text-slate-400 max-w-2xl mx-auto font-light text-lg">
                Momenty chwały, ciężkiej pracy i wspólnej radości. Zobacz jak
                trenujemy i zwyciężamy.
              </p>
            </div>

            {/* Decorative slants */}
            <div class="absolute bottom-0 left-0 right-0 h-16 bg-background-light dark:bg-background-dark clip-path-slant-up">
            </div>
          </div>

          <div class="container mx-auto px-4 py-12 -mt-20 relative z-20">
            {albums.length === 0
              ? (
                <EmptyState
                  title="Jeszcze nic tu nie ma"
                  message="Albumy pojawią się wkrótce."
                  icon="photo_library"
                />
              )
              : (
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {albums.map((album) => (
                    <a
                      href={`/galeria/${album.id}`}
                      class="group bg-white dark:bg-slate-800 rounded-3xl shadow-avant hover:shadow-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 block h-full flex flex-col border border-slate-100 dark:border-slate-700/50"
                      key={album.id}
                    >
                      <div class="h-64 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
                        {album.cover
                          ? (
                            <img
                              src={`/api/files/${album.collectionId}/${album.id}/${album.cover}?thumb=600x400`}
                              alt={album.title}
                              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          )
                          : (
                            <div class="flex items-center justify-center h-full text-slate-400">
                              <span class="material-icons-round text-6xl opacity-50">
                                photo_library
                              </span>
                            </div>
                          )}
                        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500">
                        </div>
                        <div class="absolute top-4 left-4 bg-secondary/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                          {album.category}
                        </div>
                      </div>

                      <div class="p-8 flex-grow flex flex-col justify-between relative">
                        <div>
                          <h3 class="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors text-slate-800 dark:text-white leading-tight">
                            {album.title}
                          </h3>
                          <div class="text-xs font-mono text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                            <span class="material-icons-round text-sm">
                              event
                            </span>
                            {new Date(album.date).toLocaleDateString("pl-PL", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>

                        <div class="pt-6 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                          <span class="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            Otwórz album
                          </span>
                          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span class="material-icons-round text-sm">
                              arrow_forward
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </PageShell>
  );
});
