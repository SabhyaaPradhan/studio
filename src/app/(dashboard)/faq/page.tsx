
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqs = [
    {
        question: "How does the AI respond to questions?",
        answer: "The AI uses the knowledge base you provide (documents, website content, etc.) to generate accurate and relevant answers. It understands context and will only respond with information it has been trained on."
    },
    {
        question: "How do I upgrade or downgrade my plan?",
        answer: "You can change your plan at any time from the 'Billing' page. Simply choose the plan you want, and the changes will be applied to your account. Any price difference will be prorated."
    },
    {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time from the 'Billing' page. Your plan will remain active until the end of the current billing cycle, and you will not be charged again."
    },
    {
        question: "Where can I see my usage statistics?",
        answer: "Your current usage, such as the number of AI replies for the month, is displayed on the 'Billing' page under the 'Current Plan' section."
    },
    {
        question: "How do I add more knowledge sources?",
        answer: "You can manage your knowledge sources from the 'Templates' or 'Prompt Builder' sections in the main dashboard sidebar (coming soon)."
    },
];

export default function FaqPage() {
    return (
        <div className="container mx-auto max-w-3xl py-8 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
                <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about your Savrii account.</p>
            </div>
            
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-base text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>

            <div className="mt-12 text-center">
                <h2 className="text-2xl font-semibold mb-2">Still have questions?</h2>
                <p className="text-muted-foreground mb-4">Our team is here to help. Reach out to us anytime.</p>
                <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                </Button>
            </div>
        </div>
    );
}
