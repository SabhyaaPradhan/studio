
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { 
    Bot, 
    Mails, 
    Workflow, 
    Palette, 
    Webhook, 
    ToggleRight, 
    Check,
    X
} from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const coreFeatures = [
    { icon: Mails, title: "AI Email Writer", description: "Craft perfect, on-brand email replies in seconds for support, sales, and more." },
    { icon: Workflow, title: "Workflow Builder", description: "Automate multi-step processes with a powerful drag-and-drop interface. (Enterprise)" },
    { icon: Palette, title: "White Label Branding", description: "Customize the platform with your own branding for a seamless client experience. (Enterprise)" },
    { icon: Webhook, title: "Webhooks & Integrations", description: "Connect Savrii to thousands of apps and build custom integrations with webhooks." },
    { icon: Bot, title: "Real-time Chatbot", description: "Deploy an AI assistant on your website to answer questions and capture leads 24/7." },
    { icon: ToggleRight, title: "Automation Rules", description: "Set up 'if-this-then-that' rules to handle routine tasks automatically." }
];

const comparisonFeatures = [
    { name: "Instant, 24/7 Responses", traditional: false, savrii: true },
    { name: "Zero-Shot Learning from Your Content", traditional: false, savrii: true },
    { name: "No-Code Workflow Automation", traditional: false, savrii: true },
    { name: "Consistent Brand Voice", traditional: false, savrii: true },
    { name: "High Upfront & Maintenance Costs", traditional: true, savrii: false },
    { name: "Requires Dedicated Staff", traditional: true, savrii: false },
];

export default function FeaturesPage() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Hero Animation
        gsap.fromTo(".hero-element", 
            { opacity: 0, y: 30 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.2 }
        );

        // Core Features Grid Animation
        gsap.to(".feature-card", {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".features-grid",
                start: "top 80%",
            },
        });

        // Feature Storytelling Animations
        const storySections = gsap.utils.toArray<HTMLElement>('.feature-story-section');
        storySections.forEach((section, index) => {
            const image = section.querySelector('.feature-image');
            const textContent = section.querySelector('.feature-text');
            const isReversed = index % 2 !== 0;

            const imageTween = gsap.fromTo(image, 
                { opacity: 0, x: isReversed ? 100 : -100 },
                { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
            );

            const textTween = gsap.fromTo(textContent,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
            );

            ScrollTrigger.create({
                trigger: section,
                start: 'top 75%',
                animation: gsap.timeline().add(imageTween).add(textTween, "<"),
                toggleActions: 'play none none none'
            });

            // Parallax for images
            gsap.to(image, {
                yPercent: -10,
                ease: "none",
                scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });

        // Comparison Table Animation
         gsap.from(".comparison-row", {
            opacity: 0,
            x: -30,
            stagger: 0.15,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".comparison-table",
                start: "top 80%",
            },
        });

        // Final CTA Animation
        gsap.from(".final-cta-element", {
            opacity: 0,
            scale: 0.9,
            y: 20,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.final-cta-section',
                start: 'top 80%'
            }
        });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-20 pb-10">
        <div className="absolute inset-0 bg-grid-pattern-small opacity-30 [mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_70%)]"></div>
        <div className="relative z-10">
            <h1 className="hero-element text-5xl md:text-7xl font-bold mb-4 tracking-tighter">Everything you need to scale smarter.</h1>
            <p className="hero-element text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Automate customer engagement, emails, workflows, and more—all in one intelligent platform that learns from your content.
            </p>
            <div className="hero-element">
                <Button size="lg" asChild>
                    <Link href="/signup">Get Started Free</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 md:py-32 px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Powerful Features, Effortless Control</h2>
            <p className="text-lg text-muted-foreground mt-4">Savrii is packed with tools designed to save you time and improve your customer interactions from day one.</p>
        </div>
        <div className="features-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {coreFeatures.map((feature, i) => (
                <div key={i} className="feature-card bg-card p-8 rounded-2xl shadow-sm border border-transparent hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 opacity-0 -translate-y-12">
                    <feature.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Feature Storytelling Sections */}
      <div className="space-y-20 md:space-y-32 py-20 md:py-32">
        <div className="feature-story-section container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="feature-image">
                <Image src="https://images.unsplash.com/photo-1557200134-90327ee9fafa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxlbWFpbHxlbnwwfHx8fDE3NTY1NzQwNTF8MA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="email inbox" alt="AI Email Writer" width={600} height={400} className="rounded-2xl shadow-2xl object-cover" />
            </div>
            <div className="feature-text">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Craft the perfect reply, every time.</h3>
                <p className="text-lg text-muted-foreground mb-6">Our AI Email Writer analyzes customer queries and uses your brand voice to generate professional, context-aware responses. Slash your reply time and never write the same email twice.</p>
                <Button variant="link" className="p-0 h-auto text-lg" asChild><Link href="/#">Learn more <span aria-hidden="true">→</span></Link></Button>
            </div>
        </div>

         <div className="feature-story-section container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="feature-text md:order-2">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Build automations with zero code.</h3>
                <p className="text-lg text-muted-foreground mb-6">Connect your tools and create powerful, multi-step automations with our visual Workflow Builder. From lead qualification to customer onboarding, automate any process imaginable.</p>
                <Button variant="link" className="p-0 h-auto text-lg" asChild><Link href="/#">Learn more <span aria-hidden="true">→</span></Link></Button>
            </div>
             <div className="feature-image md:order-1">
                <Image src="https://images.unsplash.com/photo-1603791452906-af1740e171bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNnx8ZW1haWx8ZW58MHx8fHwxNzU2NTc0MDUxfDA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="workflow diagram" alt="Workflow Builder" width={600} height={401} className="rounded-2xl shadow-2xl object-cover" />
            </div>
        </div>

        <div className="feature-story-section container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="feature-image">
                <Image src="https://images.unsplash.com/photo-1627896181038-a0cf83c86008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxjdXN0b21pemV8ZW58MHx8fHwxNzU2NTc0MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080" data-ai-hint="custom branding" alt="White Label" width={600} height={402} className="rounded-2xl shadow-2xl object-cover" />
            </div>
            <div className="feature-text">
                <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your Brand, Your Platform.</h3>
                <p className="text-lg text-muted-foreground mb-6">Deliver a seamless brand experience with white-labeling. Customize the dashboard with your logo, colors, and domain to create a professional, unified look for your clients and team.</p>
                <Button variant="link" className="p-0 h-auto text-lg" asChild><Link href="/#">Learn more <span aria-hidden="true">→</span></Link></Button>
            </div>
        </div>
      </div>

       {/* Comparison Table */}
      <section className="py-20 md:py-32 px-6 bg-secondary/30">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">A smarter way to work</h2>
            <p className="text-lg text-muted-foreground mt-4">See how Savrii stacks up against traditional, manual approaches to customer communication.</p>
        </div>
        <div className="comparison-table max-w-4xl mx-auto border rounded-2xl bg-background/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <div className="grid grid-cols-3 p-4 bg-secondary/50 font-semibold">
                <div className="col-span-1"></div>
                <div className="text-center">Traditional Tools</div>
                <div className="text-center text-primary">Savrii</div>
            </div>
            {comparisonFeatures.map((feature, i) => (
                <div key={i} className="comparison-row grid grid-cols-3 p-4 border-t items-center">
                    <p className="font-medium">{feature.name}</p>
                    <div className="flex justify-center">{feature.traditional ? <Check className="h-6 w-6 text-destructive" /> : <X className="h-6 w-6 text-muted-foreground" />}</div>
                    <div className="flex justify-center">{feature.savrii ? <Check className="h-6 w-6 text-primary" /> : <X className="h-6 w-6 text-muted-foreground" />}</div>
                </div>
            ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section py-24 px-6 text-center">
        <h2 className="final-cta-element text-4xl md:text-5xl font-bold mb-4 tracking-tighter">Start automating your business today.</h2>
        <p className="final-cta-element text-lg text-muted-foreground mb-8">Join hundreds of founders and small teams saving time with Savrii.</p>
        <div className="final-cta-element">
            <Button size="lg" asChild>
                <Link href="/signup">Get Started - It's Free</Link>
            </Button>
        </div>
      </section>
    </div>
  );
}
