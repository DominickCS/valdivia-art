import { useRef, useState } from "react";
import type { ArtworkImage } from "../../types/definitions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLImageElement>) {
    const img = imgRef.current;
    if (!img) return;
    const { left, top, width, height } = img.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }

  function handleMouseLeave() {
    const img = imgRef.current;
    if (!img) return;
    img.style.transformOrigin = "center center";
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="object-contain max-h-[80vh] w-full transition-transform duration-500 ease-out hover:scale-250 cursor-zoom-in"
    />
  );
}

function ImageModal({ images, startIndex, onClose }: {
  images: ArtworkImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(startIndex);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function prev() { setCurrent(i => (i - 1 + images.length) % images.length); }
  function next() { setCurrent(i => (i + 1) % images.length); }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="relative flex flex-col items-center w-full max-w-3xl px-12">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm tracking-widest transition-colors"
        >
          CLOSE ✕
        </button>

        {/* Image with zoom */}
        <div className="overflow-hidden w-full">
          <ZoomImage
            src={images[current].imageURL}
            alt={`Artwork image ${current + 1}`}
          />
        </div>

        {/* Nav — only show if multiple images */}
        {images.length > 1 && (
          <div className="flex items-center gap-6 mt-4">
            <button onClick={prev} className="text-white/70 hover:text-white transition-colors text-lg">
              ←
            </button>
            <span className="text-white/50 text-xs tracking-widest">
              {current + 1} / {images.length}
            </span>
            <button onClick={next} className="text-white/70 hover:text-white transition-colors text-lg">
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function ArtworkCarousel({ images }: { images: ArtworkImage[] }) {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  return (
    <>
      <Carousel className="sm:min-w-xl mx-auto min-w-xs">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id} className="flex items-center justify-center">
              <img
                src={image.imageURL}
                alt={`Artwork image ${index + 1}`}
                onClick={() => setModalIndex(index)}
                className="object-contain w-full h-auto cursor-zoom-in"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {modalIndex !== null && (
        <ImageModal
          images={images}
          startIndex={modalIndex}
          onClose={() => setModalIndex(null)}
        />
      )}
    </>
  );
}
