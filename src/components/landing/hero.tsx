import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,white_50%,transparent_100%)]"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center gap-6">
            <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
            >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                    Automate Customer Conversations <br /> with Your Own Content
                </h1>
            </div>
            <div
                className="animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
            >
                <p className="max-w-3xl text-lg md:text-xl text-muted-foreground">
                    Upload your knowledge once. Let AI handle the rest—24/7, no code, no team required.
                </p>
            </div>
            <div
                className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
                style={{ animationDelay: "0.6s" }}
            >
                <Button size="lg">Start Free</Button>
                <Button size="lg" variant="outline">Book a Demo</Button>
            </div>
        </div>
    </section>
  );
}
