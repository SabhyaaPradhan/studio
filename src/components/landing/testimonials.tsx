"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            <CarouselItem>
              <div className="p-1">
                <Card className="bg-card">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center h-56">
                    <blockquote className="text-xl md:text-2xl font-medium">
                      “I replaced 80% of my support messages with Savrii in one week. Game changer.”
                    </blockquote>
                    <p className="mt-4 text-muted-foreground">— Beta User (Coming Soon)</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
             <CarouselItem>
              <div className="p-1">
                <Card className="bg-card">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center h-56">
                    <blockquote className="text-xl md:text-2xl font-medium">
                      “The setup was incredibly fast. I had a working assistant on my site in 15 minutes.”
                    </blockquote>
                    <p className="mt-4 text-muted-foreground">— Early Adopter (Coming Soon)</p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="border-border bg-card hover:bg-secondary" />
          <CarouselNext className="border-border bg-card hover:bg-secondary" />
        </Carousel>
      </div>
    </section>
  );
}
