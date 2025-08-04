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
  { name: "Gmail", src: "https://logo.clearbit.com/gmail.com" },
  { name: "Meta", src: "https://logo.clearbit.com/meta.com" },
  { name: "WhatsApp", src: "https://logo.clearbit.com/whatsapp.com" },
  { name: "Outlook", src: "https://logo.clearbit.com/microsoft.com" },
  { name: "Facebook", src: "https://logo.clearbit.com/facebook.com" },
  { name: "Instagram", src: "https://logo.clearbit.com/instagram.com" },
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
                <div className="flex items-center justify-center h-20 text-muted-foreground hover:text-foreground transition-colors duration-300">
                  <Image
                    src={logo.src}
                    alt={`${logo.name} logo`}
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain"
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
