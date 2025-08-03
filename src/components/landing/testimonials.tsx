"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote: "I replaced 80% of my support messages with Savrii in one week. Game changer.",
        name: "Alex Johnson",
        title: "Founder of StartupX",
        image: "https://placehold.co/100x100.png"
    },
    {
        quote: "The setup was incredibly fast. I had a working assistant on my site in 15 minutes.",
        name: "Samantha Lee",
        title: "E-commerce Entrepreneur",
        image: "https://placehold.co/100x100.png"
    },
    {
        quote: "Our lead qualification is now completely automated. Savrii saves us hours every day.",
        name: "David Chen",
        title: "Marketing Director, TechCorp",
        image: "https://placehold.co/100x100.png"
    }
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-testimonial-element]",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-32 bg-background overflow-hidden">
       <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
       <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div data-testimonial-element className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Loved by founders like you</h2>
        </div>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
          data-testimonial-element
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
                 <CarouselItem key={index} className="md:basis-1/2">
                    <div className="p-4">
                        <Card className="bg-card/80 backdrop-blur-sm border-border h-full flex flex-col justify-between">
                            <CardContent className="p-8 flex-grow">
                                <blockquote className="text-lg md:text-xl font-medium mb-6">
                                “{testimonial.quote}”
                                </blockquote>
                            </CardContent>
                             <div className="bg-secondary/50 p-6 flex items-center gap-4 mt-auto">
                                <Image 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    width={56}
                                    height={56}
                                    className="rounded-full border-2 border-primary"
                                    data-ai-hint="profile picture"
                                />
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-border bg-card hover:bg-secondary" />
          <CarouselNext className="border-border bg-card hover:bg-secondary" />
        </Carousel>
      </div>
    </section>
  );
}
