import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const useCases = [
  { title: "Coaches & Consultants", description: "Send program details, answer DMs, and onboard new clients automatically." },
  { title: "E-commerce Sellers", description: "Answer shipping/product questions, handle returns, and offer intelligent upsells." },
  { title: "Freelancers & Creatives", description: "Automate project quotes, provide service details, and answer frequently asked questions." },
  { title: "Agencies & B2B", description: "Qualify new leads, schedule discovery calls, and provide instant info to potential clients." },
];

export default function UseCases() {
  return (
    <section className="py-20 md:py-32 bg-neutral-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter">Built for solo founders and small teams</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-300">Whatever your business, Savrii has a use case for you.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {useCases.map((useCase, index) => (
            <Card key={index} className="bg-black border-neutral-800 hover:border-primary transition-all duration-300 hover:scale-[1.02] transform">
              <CardHeader className="flex-row items-center gap-4 space-y-0">
                <CheckCircle2 className="h-8 w-8 text-primary flex-shrink-0" />
                <CardTitle className="text-white">{useCase.title}</CardTitle>
              </CardHeader>
              <CardContent className="pl-16">
                <p className="text-neutral-300">{useCase.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
