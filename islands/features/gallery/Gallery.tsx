import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import { useScrollLock } from "../shared/useScrollLock.ts";
import { useFocusTrap } from "../shared/useFocusTrap.ts";
import { useOutsideClick } from "../shared/useOutsideClick.ts";

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

export default function Gallery({ items }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => setSelectedImage(null);

  // Use custom hooks
  useScrollLock(!!selectedImage);
  useFocusTrap(!!selectedImage, modalRef, handleClose, closeButtonRef);
  const { handlePointerDown, handlePointerUp } = useOutsideClick(
    modalRef,
    handleClose,
    !!selectedImage,
  );

  // Optimize handlers with useCallback
  const handleNext = useCallback((e?: Event) => {
    e?.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = items.findIndex((item) =>
      item.id === selectedImage.id
    );
    const nextIndex = (currentIndex + 1) % items.length;
    setSelectedImage(items[nextIndex]);
  }, [items, selectedImage]);

  const handlePrev = useCallback((e?: Event) => {
    e?.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = items.findIndex((item) =>
      item.id === selectedImage.id
    );
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setSelectedImage(items[prevIndex]);
  }, [items, selectedImage]);

  // Touch Swipe Logic (Moved up to avoid conditional hook error)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleSwipe = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) { // 50px threshold
      if (diff > 0) handleNext(); // Swiped Left
      else handlePrev(); // Swiped Right
    }
  }, [handleNext, handlePrev]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  // Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "Escape") handleClose();
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, handleNext, handlePrev, handleClose]);

  return (
    <>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            class="group relative aspect-[4/3] overflow-hidden rounded-lg cursor-pointer bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setSelectedImage(item)}
            tabIndex={0}
            role="button"
            aria-label={`Zobacz zdjęcie: ${item.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedImage(item);
              }
            }}
          >
            <img
              src={`/api/files/${item.collectionId}/${item.id}/${item.image}?thumb=400x300`}
              alt={item.title}
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
              loading="lazy"
              width="400"
              height="300"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p class="text-white text-sm font-medium truncate transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                {item.title}
              </p>
            </div>
            <div class="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/50 transition-all duration-300 rounded-lg z-10">
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div
        class={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 transition-opacity duration-300 motion-reduce:duration-0 ${
          selectedImage
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {selectedImage && (
          <div
            ref={modalRef}
            class="relative max-w-6xl w-full h-full flex flex-col items-center justify-center touch-pan-y"
            role="dialog"
            aria-modal="true"
            aria-label={selectedImage.title}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Close Button */}
            <button
              type="button"
              ref={closeButtonRef}
              class="absolute top-4 right-4 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-white/20 rounded-full p-2 transition-all focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setSelectedImage(null)}
              aria-label="Zamknij"
            >
              <span class="material-icons-round text-3xl">close</span>
            </button>

            {/* Prev Button */}
            <button
              type="button"
              class="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-white/20 rounded-full p-3 transition-opacity md:flex hidden focus:outline-none focus:ring-2 focus:ring-white"
              onClick={handlePrev}
              aria-label="Poprzednie zdjęcie"
            >
              <span class="material-icons-round text-4xl">chevron_left</span>
            </button>

            {/* Next Button */}
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/50 hover:text-white bg-black/20 hover:bg-white/20 rounded-full p-3 transition-opacity md:flex hidden focus:outline-none focus:ring-2 focus:ring-white"
              onClick={handleNext}
              aria-label="Następne zdjęcie"
            >
              <span class="material-icons-round text-4xl">chevron_right</span>
            </button>

            {/* Image Container */}
            <div class="relative w-full h-full flex items-center justify-center p-4 md:p-12">
              <img
                src={`/api/files/${selectedImage.collectionId}/${selectedImage.id}/${selectedImage.image}`}
                alt={selectedImage.title}
                class="max-w-full max-h-full object-contain shadow-2xl animate-scale-up motion-reduce:animate-none select-none"
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
            </div>

            {selectedImage.title && (
              <div class="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                <div class="inline-block bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                  <h3
                    id="modal-title"
                    class="text-white font-heading font-bold text-lg"
                  >
                    {selectedImage.title}
                  </h3>
                </div>
              </div>
            )}

            {/* Mobile Touch Overlay for futureSwipe */}
          </div>
        )}
      </div>
    </>
  );
}
