import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <section className="py-20 md:py-32 bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">Ready to automate your inbox?</h2>
        <p className="mt-4 max-w-xl mx-auto text-lg text-neutral-300">
          Stop repeating yourself. Start converting visitors. Get your AI assistant today.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Start Free</Button>
          <Button size="lg" variant="outline">See Live Demo</Button>
        </div>
      </div>
    </section>
  );
}
