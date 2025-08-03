"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

export default function Cta() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-cta-element]",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
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

      gsap.to(buttonRef.current, {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play pause resume pause",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 data-cta-element className="text-3xl md:text-5xl font-bold tracking-tighter">Ready to automate your inbox?</h2>
        <p data-cta-element className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
          Stop repeating yourself. Start converting visitors. Get your AI assistant today.
        </p>
        <div data-cta-element className="mt-8 flex justify-center gap-4">
          <Button ref={buttonRef} size="lg">Start Free</Button>
        </div>
      </div>
    </section>
  );
}
