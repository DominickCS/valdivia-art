import type { ArtworkImage } from "../../types/definitions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

export function ArtworkCarousel({ images }: { images: ArtworkImage[] }) {
  return (
    <Carousel className="w-full max-w-48 sm:max-w-xs">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.id}>
            <img src={image.imageURL} alt={`Artwork image ${index + 1}`} className="w-full h-full object-contain" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
