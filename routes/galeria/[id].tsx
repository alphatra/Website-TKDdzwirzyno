import { PageProps } from "fresh";
import pb from "../../utils/pb.ts";
import GalleryIsland from "../../islands/Gallery.tsx";
import { Handlers } from "fresh/compat";
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

interface Data {
  album: Album;
  photos: Photo[];
}

export const handler: Handlers<Data> = {
  async GET(ctx) {
    const id = ctx.params.id;
    try {
      const album = await pb.collection("albums").getOne<Album>(id);
      const photos = await pb.collection("photos").getList<Photo>(1, 100, {
        filter: `album = "${id}"`,
      });

      return ctx.render({ album, photos: photos.items });
    } catch (e) {
      throw new HttpError(404);
    }
  },
};

export default function AlbumView({ data }: PageProps<Data>) {
  const { album, photos } = data;

  // Transform photos for the Gallery Island
  const galleryItems = photos.map((p) => ({
    id: p.id,
    title: p.caption || "Zdjęcie",
    image: p.image,
    collectionId: p.collectionId,
  }));

  return (
    <>
      <div class="bg-gray-900 text-white py-12">
        <div class="container-custom">
          <a
            href="/galeria"
            class="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors font-bold uppercase tracking-wider text-sm"
          >
            <svg
              class="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              >
              </path>
            </svg>
            Powrót do Galerii
          </a>
          <h1 class="text-3xl md:text-5xl font-heading font-bold mb-4">
            {album.title}
          </h1>
          <div
            class="prose prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: album.description }}
          />
        </div>
      </div>

      <div class="container-custom py-12">
        {galleryItems.length === 0
          ? (
            <p class="text-center text-gray-500 text-xl py-20">
              Ten album jest pusty.
            </p>
          )
          : <GalleryIsland items={galleryItems} />}
      </div>
    </>
  );
}
