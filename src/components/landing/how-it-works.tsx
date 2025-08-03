"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { UploadCloud, Link2, Bot, GanttChartSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: UploadCloud,
    title: "Upload Your Content",
    description: "Add your documents, website content, or just write down prompts and answers for the AI.",
  },
  {
    icon: Link2,
    title: "Connect to Your Platforms",
    description: "Integrate with your website, social media inboxes, or other customer-facing platforms.",
  },
  {
    icon: Bot,
    title: "Let AI Respond",
    description: "The AI assistant starts answering questions from leads and clients based on the knowledge you provided.",
  },
  {
    icon: GanttChartSquare,
    title: "Track and Refine",
    description: "Monitor conversations, see what's being asked, and refine the AI's answers to improve performance.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-step-card]",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div ref={sectionRef} className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">How It Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">A simple, 4-step process to automate your customer support.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} data-step-card className="opacity-0">
              <Card className="bg-card border-border text-center h-full transition-transform duration-300 hover:scale-105">
                <CardHeader className="items-center">
                  <div className="p-4 bg-secondary rounded-full transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="mt-4">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
