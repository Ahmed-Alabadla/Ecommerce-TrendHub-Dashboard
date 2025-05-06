import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types/product";
import Image from "next/image";

export default function ProductImagesDialog({ product }: { product: Product }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="h-12 w-12 flex items-center justify-center rounded-md border p-0.5 overflow-hidden cursor-pointer bg-white">
          <Image
            src={product.imageCover}
            alt={product.name}
            width={48}
            height={48}
            className="object-cover object-center rounded-md"
          />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Product Images - {product.name}</DialogTitle>
          <DialogDescription>
            Browse through all product images
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Carousel className="w-full">
            <CarouselContent>
              {product.images?.map((image, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  <AspectRatio
                    ratio={16 / 9}
                    className="relative w-full max-w-md"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - image ${index + 1}`}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </AspectRatio>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4 gap-2">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
}
