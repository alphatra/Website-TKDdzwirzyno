import { useState, useRef } from "preact/hooks";
import { type JSX } from "preact";

interface GalleryItem {
  id: string;
  collectionId: string;
  image: string;
  title: string;
  description?: string;
  date?: string;
}

interface GalleryProps {
  items: GalleryItem[];
}

import { useScrollLock } from "./hooks/useScrollLock.ts";
import { useFocusTrap } from "./hooks/useFocusTrap.ts";

export default function Gallery({ items }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => setSelectedImage(null);

  // Use custom hooks
  useScrollLock(!!selectedImage);
  useFocusTrap(!!selectedImage, modalRef, handleClose, closeButtonRef);

  const handleOpen = (item: GalleryItem, e: JSX.TargetedMouseEvent<HTMLDivElement> | JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    setSelectedImage(item);
  };


  if (!items || items.length === 0) {
    return (
      <div class="card text-center py-12">
        <div class="text-6xl mb-4">🖼️</div>
        <h3 class="text-2xl font-bold text-gray-700">Galeria jest pusta</h3>
        <p class="text-gray-500 mt-2">Daj nam chwilę na wgranie zdjęć.</p>
      </div>
    );
  }

  const handleBackdropPointerDown = (e: PointerEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setSelectedImage(null);
    }
  };

  return (
    <>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={(e) => handleOpen(item, e)}
            onKeyDown={(e) => {
               if (e.key === "Enter" || e.key === " ") {
                 e.preventDefault();
                 handleOpen(item, e);
               }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Zobacz zdjęcie: ${item.title}`}
            class="group relative overflow-hidden rounded-xl shadow-lg aspect-video cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all"
          >
            <img
              src={`/api/files/${item.collectionId}/${item.id}/${item.image}?thumb=400x300`}
              alt={item.title}
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 motion-reduce:transition-none motion-reduce:transform-none"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none flex items-center justify-center">
              <span class="text-white font-bold text-lg">{item.title}</span>
            </div>

            {/* Hover Claw Effect */}
            <div class="absolute top-0 right-0 w-12 h-12 bg-secondary text-white flex items-center justify-center rounded-bl-xl translate-x-full -translate-y-full group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300">
              <span class="text-xl">🔍</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div
        class={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 transition-opacity duration-300 motion-reduce:duration-0 ${
          selectedImage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onPointerDown={handleBackdropPointerDown}
      >
        {selectedImage && (
          <div
            ref={modalRef}
            class="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              class="absolute -top-12 right-0 text-white hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
              onClick={() => setSelectedImage(null)}
              aria-label="Zamknij"
            >
              <span class="material-icons-round text-4xl">close</span>
            </button>

            <img
              src={`/api/files/${selectedImage.collectionId}/${selectedImage.id}/${selectedImage.image}`}
              alt={selectedImage.title}
              class="max-w-full max-h-[80vh] object-contain rounded shadow-2xl animate-scale-up motion-reduce:animate-none"
              loading="eager"
            />

            {selectedImage.title && (
              <div class="mt-4 text-white text-center">
                <h3 id="modal-title" class="text-2xl font-heading font-bold">
                  {selectedImage.title}
                </h3>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
