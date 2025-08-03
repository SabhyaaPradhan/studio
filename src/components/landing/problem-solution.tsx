"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-background opacity-0">
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
