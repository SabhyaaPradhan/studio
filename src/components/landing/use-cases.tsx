"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  { title: "Coaches & Consultants", description: "Send program details, answer DMs, and onboard new clients automatically." },
  { title: "E-commerce Sellers", description: "Answer shipping/product questions, handle returns, and offer intelligent upsells." },
  { title: "Freelancers & Creatives", description: "Automate project quotes, provide service details, and answer frequently asked questions." },
  { title: "Agencies & B2B", description: "Qualify new leads, schedule discovery calls, and provide instant info to potential clients." },
];

export default function UseCases() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLDivElement>("[data-use-case-card]");
    const ctx = gsap.context(() => {
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.to(card, {
          y: -20,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Built for solo founders and small teams</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Whatever your business, Savrii has a use case for you.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Card 
              key={index}
              data-use-case-card
              className="bg-background border-border hover:border-primary transition-all duration-300 hover:scale-[1.02] transform"
            >
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <CheckCircle2 className="h-8 w-8 text-primary flex-shrink-0" />
                <CardTitle>{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="pl-16">
                <p className="text-muted-foreground">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
