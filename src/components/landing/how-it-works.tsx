"use client";

import { useRef, useEffect, useState } from "react";
import { UploadCloud, Link2, Bot, GanttChartSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <section className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">How It Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300">A simple, 4-step process to automate your customer support.</p>
        </div>
        <div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className={cn("opacity-0", isVisible && "animate-fade-in-up")} style={{ animationDelay: `${index * 150}ms` }}>
                <Card className="bg-neutral-900 border-neutral-800 text-center h-full">
                    <CardHeader className="items-center">
                        <div className="p-4 bg-neutral-800 rounded-full">
                            <step.icon className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="mt-4 text-white">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-neutral-300">{step.description}</p>
                    </CardContent>
                </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
