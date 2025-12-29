import { useState } from "preact/hooks";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  collectionId: string;
}

interface GalleryProps {
  items: GalleryItem[];
}

export default function Gallery({ items }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  if (!items || items.length === 0) {
    return (
      <div class="card text-center py-12">
        <div class="text-6xl mb-4">🖼️</div>
        <h3 class="text-2xl font-bold text-gray-700">Galeria jest pusta</h3>
        <p class="text-gray-500 mt-2">Daj nam chwilę na wgranie zdjęć.</p>
      </div>
    );
  }

  return (
    <>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            class="group relative overflow-hidden rounded-xl shadow-lg aspect-video cursor-pointer"
          >
            <img
              src={`https://admin.tkddzwirzyno.pl/api/files/${item.collectionId}/${item.id}/${item.image}`}
              alt={item.title}
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <h3 class="text-white font-heading font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {item.title}
              </h3>
            </div>

            {/* Hover Claw Effect */}
            <div class="absolute top-0 right-0 w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-bl-xl translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
              <span class="text-xl">🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div class="relative max-w-7xl max-h-[90vh] w-full flex flex-col items-center">
            {/* Close Button */}
            <button
              class="absolute -top-12 right-0 text-white hover:text-secondary text-4xl transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>

            <img
              src={`https://admin.tkddzwirzyno.pl/api/files/${selectedImage.collectionId}/${selectedImage.id}/${selectedImage.image}`}
              alt={selectedImage.title}
              class="max-w-full max-h-[80vh] object-contain rounded shadow-2xl animate-scale-up"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
            />

            {selectedImage.title && (
              <div class="mt-4 text-white text-center">
                <h3 class="text-2xl font-heading font-bold">
                  {selectedImage.title}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
