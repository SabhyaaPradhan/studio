"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const logos = [
  { name: "Gmail", path: "M22.28 29.32H5.4V2.6H24.32C27.04 2.6 29.28 3.32 31.04 4.76C32.8 6.2 33.72 8.16 33.72 10.64C33.72 12.52 33.16 14.12 32.04 15.44C30.92 16.76 29.44 17.6 27.6 18L35.2 29.32H27.08L20.2 18.52H13V29.32H22.28ZM13 14.92H23.4C24.8 14.92 25.88 14.52 26.64 13.72C27.4 12.92 27.8 11.92 27.8 10.72C27.8 9.48 27.4 8.52 26.64 7.8C25.88 7.08 24.8 6.72 23.4 6.72H13V14.92Z" },
  { name: "Meta", path: "M24.43 17.42H18.33V5.59L13.03 12.33H12.36L7.05 5.59V17.42H1V0.5H5.02L9.19 6.55L11.7 10.05H12.19L14.7 6.55L18.87 0.5H22.89V17.42H24.43Z" },
  { name: "WhatsApp", path: "M12.92 23.36L8.4 29.24L7.52 28.6C6.6 27.96 5.8 27.2 5.12 26.32L4.04 24.8L12.92 23.36ZM2.6 15.96C2.6 12.04 4.08 8.64 6.96 5.76C9.84 2.88 13.24 1.4 17.16 1.4C21.08 1.4 24.48 2.88 27.36 5.76C30.24 8.64 31.68 12.04 31.68 15.96C31.68 19.88 30.24 23.28 27.36 26.16C24.48 29.04 21.08 30.48 17.16 30.48H17.08L17.16 30.48C12.72 30.48 8.76 29 5.28 25.96L5.88 26.56L14.28 24.52L15.68 25.92L17.12 24.48L12.92 20.28L14.24 18.96L20.84 25.56L22.24 24.16L15.72 17.64L17.12 16.24L23.4 22.52L24.8 21.12L18.44 14.76L19.88 13.32L24.32 17.8L25.72 16.4L21.28 11.92L22.68 10.52L25.8 13.64L27.2 12.24L24.08 9.12L25.16 8.04L27.44 10.32L28.84 8.92L26.6 6.68L27.44 5.84L28.88 7.28L30.28 5.88L28.24 3.84C25.8 1.4 22.64 0 18.76 0C14.88 0 11.48 1.4 8.6 4.28C5.72 7.16 4.28 10.56 4.28 14.48C4.28 15.04 4.32 15.56 4.4 16.04L0 17.44L1.44 13.08L2.76 14.4L1.32 15.84L2.6 15.96Z" },
  { name: "Outlook", path: "M12.92 32C9.4 32 6.56 30.8 4.4 28.4C2.24 26 1.16 22.88 1.16 19.04V0.8H10.12V19.04C10.12 21.4 10.64 23.2 11.68 24.44C12.72 25.68 14.12 26.28 15.88 26.28C17.64 26.28 19.04 25.68 20.08 24.44C21.12 23.2 21.64 21.4 21.64 19.04V0.8H30.6V19.04C30.6 22.88 29.52 26 27.36 28.4C25.2 30.8 22.36 32 18.84 32H12.92Z" },
  { name: "Facebook", path: "M22.25 12.01C22.25 11.24 22.2 10.47 22.11 9.71H11.88V13.8H17.78C17.59 15.02 17.03 16.08 16.2 16.92V19.6H19.78C21.35 18.15 22.25 15.34 22.25 12.01Z" },
  { name: "Instagram", path: "M16.51 31.75H23.08V16.32H16.51V31.75ZM19.8 14.11C21.49 14.11 22.84 12.77 22.84 11.08C22.84 9.39 21.49 8.05 19.8 8.05C18.11 8.05 16.76 9.39 16.76 11.08C16.76 12.77 18.11 14.11 19.8 14.11Z" },
];

const viewboxMap: Record<string, string> = {
    Gmail: "0 0 108 32",
    Meta: "0 0 88 18",
    WhatsApp: "0 0 120 32",
    Outlook: "0 0 104 32",
    Facebook: "0 0 120 24",
    Instagram: "0 0 112 32",
}

const heightMap: Record<string, string> = {
    Gmail: "h-8",
    Meta: "h-5",
    WhatsApp: "h-8",
    Outlook: "h-7",
    Facebook: "h-6",
    Instagram: "h-8",
}

export default function LogoCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const extendedLogos = [...logos, ...logos];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-center text-lg text-muted-foreground mb-8 font-medium tracking-wider">
          INTEGRATES WITH YOUR FAVORITE PLATFORMS
        </h2>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-8">
            {extendedLogos.map((logo, index) => (
              <CarouselItem
                key={`${logo.name}-${index}`}
                className="pl-8 basis-1/2 md:basis-1/3 lg:basis-1/6"
              >
                <div className="flex items-center justify-center h-20 text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <svg
                    viewBox={viewboxMap[logo.name]}
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${heightMap[logo.name]} w-auto`}
                    fill="currentColor"
                  >
                    <path d={logo.path} />
                  </svg>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
