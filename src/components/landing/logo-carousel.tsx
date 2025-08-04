"use client";

import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const logos = [
    { name: "Gmail", src: "https://upload.wikimedia.org/wikipedia/commons/4/43/Gmail_Icon.svg" },
    { name: "Meta", src: "https://upload.wikimedia.org/wikipedia/commons/0/05/Meta_Platforms_Inc._logo.svg" },
    { name: "WhatsApp", src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" },
    { name: "Outlook", src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg" },
    { name: "Facebook", src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg" },
    { name: "Instagram", src: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" },
];

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
                <div className="flex items-center justify-center h-20">
                     <Image
                        src={logo.src}
                        alt={logo.name}
                        width={120}
                        height={40}
                        className="object-contain h-10 w-auto filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                    />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
