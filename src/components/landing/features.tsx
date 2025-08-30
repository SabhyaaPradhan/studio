
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "Self-service chatbot",
    image: "/images/self-service-chatbot.png",
    hint: "chatbot conversation",
  },
  {
    name: "Smart agent assistant",
    image: "/images/smart-agent-assistant.png",
    hint: "agent dashboard",
  },
  {
    name: "Content Analyzer",
    image: "/images/content-analyzer.png",
    hint: "content analysis",
  },
  {
    name: "Auto-generated tags",
    image: "/images/auto-generated-tags.png",
    hint: "tagging system",
  },
  {
    name: "Anomaly notifications",
    image: "/images/anomaly-notifications.png",
    hint: "notification bell",
  },
  {
    name: "Actionable insights",
    image: "/images/actionable-insights.png",
    hint: "data analytics",
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-primary">
            Do more in less time
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            Support your customers across channels 24/7. It delivers instant, accurate responses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-4">
            {features.map((feature) => (
              <Button
                key={feature.name}
                variant={activeFeature.name === feature.name ? "default" : "ghost"}
                className="justify-between w-full text-left text-lg py-6 transition-all duration-300"
                onMouseEnter={() => setActiveFeature(feature)}
              >
                {feature.name}
                <ChevronRight className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    activeFeature.name === feature.name ? "transform translate-x-1" : ""
                )} />
              </Button>
            ))}
          </div>
          <div className="relative flex justify-center items-center min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.name}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute"
                >
                    <Image
                        src={activeFeature.image}
                        alt={activeFeature.name}
                        width={400}
                        height={600}
                        className="object-cover rounded-2xl shadow-2xl"
                        data-ai-hint={activeFeature.hint}
                    />
                </motion.div>
              </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
