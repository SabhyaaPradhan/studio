"use client";

import { useRef, useEffect } from "react";
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
import Autoplay from "embla-carousel-autoplay";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    {
        quote: "I replaced 80% of my support messages with Savrii in one week. Game changer.",
        name: "Alex Johnson",
        title: "Founder of StartupX",
    },
    {
        quote: "The setup was incredibly fast. I had a working assistant on my site in 15 minutes.",
        name: "Samantha Lee",
        title: "E-commerce Entrepreneur",
    },
    {
        quote: "Our lead qualification is now completely automated. Savrii saves us hours every day.",
        name: "David Chen",
        title: "Marketing Director, TechCorp",
    },
    {
        quote: "As a coach, I'm constantly asked about my programs. Savrii handles all of it, letting me focus on coaching.",
        name: "Maria Rodriguez",
        title: "Business Coach",
    },
    {
        quote: "The best no-code tool I've used. It's simple, powerful, and effective.",
        name: "James Smith",
        title: "Freelance Designer",
    },
    {
        quote: "Customer satisfaction is up, and my workload is down. It's a win-win.",
        name: "Emily White",
        title: "SaaS Founder",
    },
    {
        quote: "I was skeptical about AI, but Savrii has made me a believer. It's like having a new team member.",
        name: "Michael Brown",
        title: "Consultant",
    },
    {
        quote: "It's so easy to update the knowledge base. I can add new info in seconds.",
        name: "Jessica Green",
        title: "Creator",
    },
    {
        quote: "The analytics are fantastic. I can see exactly what my customers are asking about.",
        name: "Chris Taylor",
        title: "Agency Owner",
    },
    {
        quote: "My inbox has never been cleaner. Savrii is an essential tool for my business.",
        name: "Laura Wilson",
        title: "E-commerce Seller",
    }
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

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
       <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div data-testimonial-element className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Loved by founders like you</h2>
        </div>
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
          data-testimonial-element
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
                 <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="p-4 h-full">
                        <Card className="bg-card/80 backdrop-blur-sm border-border h-full flex flex-col justify-between shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50">
                            <CardContent className="p-8 flex-grow">
                                <blockquote className="text-lg md:text-xl font-medium mb-6 italic text-foreground/90">
                                “{testimonial.quote}”
                                </blockquote>
                            </CardContent>
                             <div className="bg-secondary/50 p-6 flex items-center gap-4 mt-auto rounded-b-lg">
                                <div>
                                    <p className="font-semibold text-lg">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-border bg-card hover:bg-secondary transition-colors" />
          <CarouselNext className="border-border bg-card hover:bg-secondary transition-colors" />
        </Carousel>
      </div>
    </section>
  );
}
