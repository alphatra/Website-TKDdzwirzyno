import { define } from "../../utils.ts";
import {
  type AlbumRecord,
  pb,
  type PhotoRecord,
} from "../../utils/pocketbase.ts";
import GalleryIsland from "../../islands/features/gallery/Gallery.tsx";
import { PageShell } from "../../components/layout/PageShell.tsx";
import { ErrorState } from "../../components/ui/ErrorState.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { sanitize } from "../../utils/sanitize.ts";

// ... (existing imports/interface code)

export default define.page(async function AlbumView(props) {
  const { id } = props.params;
  const { menuPages } = props.state;
  let album: AlbumRecord | null = null;
  let photos: PhotoRecord[] = [];

  try {
    const [albumRes, photosRes] = await Promise.all([
      pb.collection("albums").getOne<AlbumRecord>(id),
      pb.collection("photos").getList<PhotoRecord>(1, 50, {
        filter: `album="${id}"`,
        sort: "created",
      }),
    ]);
    album = albumRes;
    photos = photosRes.items;
  } catch (_e) {
    // console.warn("Album fetch error", _e);
  }

  if (!album) {
    // ... (error state remains same)
    return (
      <PageShell title="Błąd - TKD Dźwirzyno" menuPages={menuPages}>
        <ErrorState
          title="Nie znaleziono albumu"
          message="Podany album nie istnieje."
          homeLink
        />
      </PageShell>
    );
  }

  // Transform photos logic remains same...
  const galleryItems = photos.map((p) => ({
    id: p.id,
    title: p.caption || "Zdjęcie",
    image: p.image,
    collectionId: p.collectionId,
  }));

  const cleanDescription = sanitize(album.description, "album");

  const ogImage = photos.length > 0
    ? `/api/files/${photos[0].collectionId}/${photos[0].id}/${photos[0].image}`
    : "/static/bg_hero.jpg";

  return (
    <PageShell
      title={`${album.title} - TKD Dźwirzyno`}
      description={`Album zdjęć: ${album.title}`}
      menuPages={menuPages}
      ogImage={ogImage}
      ogType="article"
    >
      <div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-body min-h-screen relative">
          <div class="absolute inset-0 z-0 bg-grid opacity-40 pointer-events-none">
          </div>

          <div class="relative z-10 bg-slate-900 text-white py-12 border-b border-slate-800">
            <div class="container mx-auto px-4">
              <a
                href="/galeria"
                class="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-bold uppercase tracking-wider text-xs group"
              >
                <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-primary transition-colors">
                  <span class="material-icons-round text-sm group-hover:-translate-x-0.5 transition-transform">
                    arrow_back
                  </span>
                </div>
                Powrót do Galerii
              </a>
              <h1 class="text-3xl md:text-5xl font-heading font-bold mb-4 text-white">
                {album.title}
              </h1>
              <div
                class="prose prose-invert max-w-none text-slate-400 font-light"
                // deno-lint-ignore react-no-danger
                dangerouslySetInnerHTML={{ __html: cleanDescription }}
              />
            </div>
          </div>

          <div class="container mx-auto px-4 py-12 relative z-20">
            {galleryItems.length === 0
              ? (
                <EmptyState
                  title="Ten album jest pusty"
                  message="Zdjęcia pojawią się wkrótce."
                  icon="photo_library"
                />
              )
              : <GalleryIsland items={galleryItems} />}
          </div>
        </div>
      </div>
    </PageShell>
  );
});
