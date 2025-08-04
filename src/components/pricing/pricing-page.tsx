
"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const plans = {
    monthly: [
        {
            name: "Starter",
            price: "Free",
            priceDetail: "",
            description: "Ideal for individuals",
            features: [
                "100 AI queries/month",
                "Basic AI support",
                "1 integration",
                "Email support",
            ],
            isPro: false,
        },
        {
            name: "Pro",
            price: "$29",
            priceDetail: "/month",
            description: "Great for small teams",
            features: [
                "Unlimited queries/month",
                "Advanced AI replies",
                "All integrations (Gmail, Outlook, Zapier, etc.)",
                "Real-time analytics",
                "Priority support",
            ],
            isPro: true,
        },
        {
            name: "Enterprise",
            price: "$99",
            priceDetail: "/month",
            description: "Best for agencies and power users",
            features: [
                "Unlimited queries",
                "Custom AI models + Prompt upload",
                "White-label (branding, custom domain)",
                "Workflow automation",
                "API access",
                "24/7 dedicated support",
            ],
            isPro: false,
        },
    ],
    yearly: [
         {
            name: "Starter",
            price: "Free",
            priceDetail: "",
            description: "Ideal for individuals",
            features: [
                "100 AI queries/month",
                "Basic AI support",
                "1 integration",
                "Email support",
            ],
            isPro: false,
        },
        {
            name: "Pro",
            price: "$23",
            priceDetail: "/month",
            description: "Great for small teams",
            features: [
                "Unlimited queries/month",
                "Advanced AI replies",
                "All integrations (Gmail, Outlook, Zapier, etc.)",
                "Real-time analytics",
                "Priority support",
            ],
            isPro: true,
        },
        {
            name: "Enterprise",
            price: "$79",
            priceDetail: "/month",
            description: "Best for agencies and power users",
            features: [
                "Unlimited queries",
                "Custom AI models + Prompt upload",
                "White-label (branding, custom domain)",
                "Workflow automation",
                "API access",
                "24/7 dedicated support",
            ],
            isPro: false,
        },
    ]
};

const allFeatures = [
    { name: "AI queries/month", starter: "100", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "AI support", starter: "Basic", pro: "Advanced", enterprise: "Custom Models" },
    { name: "Integrations", starter: "1", pro: "All", enterprise: "All" },
    { name: "Email support", starter: true, pro: true, enterprise: true },
    { name: "Real-time analytics", starter: false, pro: true, enterprise: true },
    { name: "Priority support", starter: false, pro: true, enterprise: true },
    { name: "Custom AI models + Prompt upload", starter: false, pro: false, enterprise: true },
    { name: "White-labeling", starter: false, pro: false, enterprise: true },
    { name: "Workflow automation", starter: false, pro: false, enterprise: true },
    { name: "API access", starter: false, pro: false, enterprise: true },
    { name: "24/7 dedicated support", starter: false, pro: false, enterprise: true },
];

const faqs = [
    {
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time from your account dashboard. Changes will be prorated."
    },
    {
        question: "Is there a discount for non-profits or students?",
        answer: "We offer special discounts for non-profit organizations and educational institutions. Please contact our support team to learn more about our programs."
    },
    {
        question: "What counts as an 'AI query'?",
        answer: "An AI query is counted every time Savrii processes and responds to a user's question or message. This includes chats, emails, and DMs handled by the assistant."
    },
    {
        question: "What happens if I go over my monthly query limit on the Starter plan?",
        answer: "If you exceed your monthly query limit on the Starter plan, your AI assistant will be temporarily paused until the next billing cycle. You'll receive notifications as you approach your limit and can upgrade to the Pro plan for unlimited queries at any time."
    }
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const currentPlans = plans[billingCycle];

    return (
        <div className="py-20 md:py-32 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Find the right plan for you</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Start for free, then scale as you grow. All plans include a 14-day free trial of our Pro features.
                    </p>

                    <div className="mt-8 flex justify-center items-center gap-4">
                        <span className={cn("font-medium", billingCycle === "monthly" ? "text-primary" : "text-muted-foreground")}>Monthly</span>
                        <Switch
                            checked={billingCycle === "yearly"}
                            onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                            aria-label="Toggle billing cycle"
                        />
                         <span className={cn("font-medium", billingCycle === "yearly" ? "text-primary" : "text-muted-foreground")}>
                            Yearly <span className="text-accent text-sm font-semibold ml-1">(20% off)</span>
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {currentPlans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="h-full"
                        >
                            <Card className={cn("flex flex-col h-full border-2", plan.isPro ? "border-primary shadow-2xl shadow-primary/20" : "border-border")}>
                                {plan.isPro && (
                                     <div className="px-6 py-2 bg-primary text-primary-foreground text-center font-semibold text-sm rounded-t-lg -mt-px">
                                        Most Popular
                                    </div>
                                )}
                                <CardHeader className="items-center text-center">
                                    <CardTitle className="text-3xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="text-center mb-6">
                                        <span className="text-5xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.priceDetail}</span>
                                    </div>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <Check className="h-5 w-5 text-accent flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full" variant={plan.isPro ? "default" : "outline"}>
                                        <a href={`/signup?plan=${plan.name.toLowerCase()}`}>Get Started</a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 md:mt-32">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Compare Features</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                            A detailed look at what each plan offers.
                        </p>
                    </div>
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-secondary">
                                        <th className="p-6 text-lg font-medium">Features</th>
                                        <th className="p-6 text-lg font-medium text-center">Starter</th>
                                        <th className="p-6 text-lg font-medium text-center">Pro</th>
                                        <th className="p-6 text-lg font-medium text-center">Enterprise</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allFeatures.map((feature, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="p-6 font-medium">{feature.name}</td>
                                            <td className="p-6 text-center text-muted-foreground">
                                                {typeof feature.starter === "boolean" ? (
                                                    feature.starter ? <Check className="h-6 w-6 text-accent mx-auto" /> : <X className="h-6 w-6 text-muted-foreground mx-auto" />
                                                ) : (
                                                    <span>{feature.starter}</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-center text-muted-foreground">
                                                {typeof feature.pro === "boolean" ? (
                                                    feature.pro ? <Check className="h-6 w-6 text-accent mx-auto" /> : <X className="h-6 w-6 text-muted-foreground mx-auto" />
                                                ) : (
                                                    <span>{feature.pro}</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-center text-muted-foreground">
                                                {typeof feature.enterprise === "boolean" ? (
                                                    feature.enterprise ? <Check className="h-6 w-6 text-accent mx-auto" /> : <X className="h-6 w-6 text-muted-foreground mx-auto" />
                                                ) : (
                                                    <span>{feature.enterprise}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="mt-24 md:mt-32">
                    <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">🙋‍♀️ Frequently Asked Questions</h2>
                        </div>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="text-lg hover:no-underline text-left">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}

