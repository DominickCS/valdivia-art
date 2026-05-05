import type { ArtworkImage } from "../../types/definitions";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./carousel";

export function ArtworkCarousel({ images }: { images: ArtworkImage[] }) {
  return (
    <Carousel className="sm:min-w-xl mx-auto min-w-xs">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.id}>
            <img src={image.imageURL} alt={`Artwork image ${index + 1}`} className="object-fill min-h-full" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
