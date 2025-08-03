"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ProblemSolution() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);
  
  return (
    <section ref={ref} className={cn("py-20 md:py-32 bg-background", isVisible ? "animate-fade-in-up" : "opacity-0")}>
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
          You're losing time answering the same questions.
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
          Whether you’re a coach, consultant, or e-commerce seller—customers keep asking the same things: pricing, availability, returns, what’s next... Savrii turns your info into an AI assistant that answers for you, instantly.
        </p>
      </div>
    </section>
  );
}
