
'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface LegalSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function LegalSection({ title, children, className }: LegalSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const contentParas = contentRef.current?.children;

    if (heading && contentParas) {
      const ctx = gsap.context(() => {
        // Animate heading
        gsap.fromTo(
          heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );

        // Animate paragraphs
        gsap.fromTo(
          contentParas,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    }
  }, []);

  return (
    <section ref={sectionRef} className={cn('py-8', className)}>
      <h2 ref={headingRef} className="text-2xl md:text-3xl font-bold mb-6">
        {title}
      </h2>
      <div ref={contentRef} className="space-y-4 text-muted-foreground leading-relaxed">
        {children}
      </div>
    </section>
  );
}
