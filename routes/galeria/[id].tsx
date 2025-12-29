// @deno-types="npm:@types/sanitize-html"
import sanitizeHtml from "sanitize-html";
import { define } from "../../utils.ts";
import { Head } from "fresh/runtime";
import pb from "../../utils/pb.ts";
import GalleryIsland from "../../islands/Gallery.tsx";
import { HttpError } from "fresh";

interface Album {
  id: string;
  title: string;
  description: string;
  collectionId: string;
}

interface Photo {
  id: string;
  image: string;
  caption: string;
  collectionId: string;
}

export default define.page(async function AlbumView(props) {
  const id = props.params.id;
  let album: Album | null = null;
  let photos: Photo[] = [];

  try {
      album = await pb.collection("albums").getOne<Album>(id);
      const photosResult = await pb.collection("photos").getList<Photo>(1, 100, {
        filter: `album = "${id}"`,
      });
      photos = photosResult.items;
  } catch (e) {
      console.error("Error fetching album:", e);
      // In a real app we might want to throw a 404 here or return a specific 404 component
      // throw new HttpError(404); 
  }

  if (!album) {
      return (
          <div class="min-h-screen bg-slate-900 text-white flex items-center justify-center">
              <div class="text-center">
                  <h1 class="text-4xl font-bold mb-4">Nie znaleziono albumu</h1>
                  <a href="/galeria" class="text-primary hover:underline">Powrót do galerii</a>
              </div>
          </div>
      )
  }

  // Transform photos for the Gallery Island
  const galleryItems = photos.map((p) => ({
    id: p.id,
    title: p.caption || "Zdjęcie",
    image: p.image,
    collectionId: p.collectionId,
  }));

  const cleanDescription = sanitizeHtml(album.description, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
      allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          'img': [ 'src', 'alt', 'class' ]
      }
  });

  return (
    <div class="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
        <div class="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-body min-h-screen relative">
            <div class="absolute inset-0 z-0 bg-grid opacity-40 pointer-events-none"></div>

      <div class="relative z-10 bg-slate-900 text-white py-12 border-b border-slate-800">
        <div class="container mx-auto px-4">
          <a
            href="/galeria"
            class="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-bold uppercase tracking-wider text-xs group"
          >
            <div class="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-primary transition-colors">
                <span class="material-icons-round text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            </div>
            Powrót do Galerii
          </a>
          <h1 class="text-3xl md:text-5xl font-heading font-bold mb-4 text-white">
            {album.title}
          </h1>
          {/* deno-lint-ignore react-no-danger */}
          <div
            class="prose prose-invert max-w-none text-slate-400 font-light"
            dangerouslySetInnerHTML={{ __html: cleanDescription }}
          />
        </div>
      </div>

      <div class="container mx-auto px-4 py-12 relative z-20">
        {galleryItems.length === 0
          ? (
            <div class="text-center py-20">
               <div class="text-6xl mb-6 opacity-50 grayscale">📂</div>
              <p class="text-slate-500 text-xl font-light">
                Ten album jest pusty.
              </p>
            </div>
          )
          : <GalleryIsland items={galleryItems} />}
      </div>
      </div>
    </div>
  );
});
