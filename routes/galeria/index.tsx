import { PageProps } from "fresh";
import pb from "../../utils/pb.ts";
import { Handlers } from "fresh/compat";

interface Album {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  cover: string;
  collectionId: string;
}

interface Data {
  albums: Album[];
}

export const handler: Handlers<Data> = {
  async GET(ctx) {
    const records = await pb.collection("albums").getList<Album>(1, 50, {
      sort: "-date",
    });
    return ctx.render({ albums: records.items });
  },
};

export default function Gallery({ data }: PageProps<Data>) {
  const { albums } = data;

  return (
    <>
      <div class="bg-primary text-white py-20 pb-32 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
        <div class="container-custom relative z-10 text-center">
          <h1 class="text-4xl md:text-5xl font-heading font-bold mb-4">
            Galeria Wydarzeń
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Wspomnienia z naszych obozów, zawodów i treningów.
          </p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-white clip-path-slant-up">
        </div>
      </div>

      <div class="container-custom py-12 -mt-20 relative z-20">
        {albums.length === 0
          ? (
            <div class="text-center py-20 bg-white rounded-xl shadow-xl">
              <p class="text-gray-500 text-xl">Brak albumów w galerii.</p>
            </div>
          )
          : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <a
                  href={`/galeria/${album.id}`}
                  class="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 block h-full flex flex-col"
                >
                  <div class="h-64 bg-gray-200 relative overflow-hidden">
                    {album.cover
                      ? (
                        <img
                          src={`http://127.0.0.1:8090/api/files/${album.collectionId}/${album.id}/${album.cover}`}
                          alt={album.title}
                          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )
                      : (
                        <div class="flex items-center justify-center h-full text-gray-400">
                          <span class="text-5xl">📷</span>
                        </div>
                      )}
                    <div class="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {album.category}
                    </div>
                  </div>
                  <div class="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 class="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      <div class="text-sm text-gray-500 mb-4 flex items-center">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          >
                          </path>
                        </svg>
                        {new Date(album.date).toLocaleDateString("pl-PL")}
                      </div>
                    </div>
                    <div class="text-primary font-bold text-sm uppercase tracking-wider flex items-center mt-4">
                      Zobacz zdjęcia{" "}
                      <span class="ml-2 group-hover:translate-x-2 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
      </div>
    </>
  );
}
