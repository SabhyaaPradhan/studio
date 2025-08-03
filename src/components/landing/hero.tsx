"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-element]",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative h-screen flex items-center justify-center text-center bg-background overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"></div>
      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center gap-6">
        <div data-hero-element>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
            Automate Customer Conversations <br /> with Your Own Content
          </h1>
        </div>
        <div data-hero-element>
          <p className="max-w-3xl text-lg md:text-xl text-muted-foreground">
            Upload your knowledge once. Let AI handle the rest—24/7, no code, no team required.
          </p>
        </div>
        <div
          data-hero-element
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="transition-transform duration-300 hover:scale-105">Start Free</Button>
        </div>
      </div>
    </section>
  );
}
