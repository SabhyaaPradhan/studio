
"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What is Savrii?",
        answer: "Savrii is an AI-powered assistant that automates customer communication using your content. Upload your prompts or documents once, and it handles client questions 24/7—no coding needed."
    },
    {
        question: "Who is Savrii for?",
        answer: "It's designed for solo founders, coaches, consultants, and small e-commerce businesses who want to reduce manual DMs and focus on real work."
    },
    {
        question: "Can I customize the AI responses?",
        answer: "Yes! You have full control over the tone, style, and scope of replies. You can upload prompts, FAQs, or detailed documents to guide how Savrii replies."
    },
    {
        question: "What platforms does Savrii integrate with?",
        answer: "Savrii connects with WhatsApp, Gmail, Messenger, Instagram DMs, and many CRMs and chat tools (via API or Zapier)."
    },
    {
        question: "Is any coding required?",
        answer: "Nope! Savrii was built to be 100% no-code. Just upload content and connect your chat tools. That’s it."
    },
    {
        question: "How secure is my data?",
        answer: "All your data is encrypted at rest and in transit. We follow strict security protocols to ensure your content stays private."
    },
    {
        question: "What happens after my free trial ends?",
        answer: "You can upgrade to a paid plan or cancel anytime. There’s no lock-in, and all your settings will be saved."
    }
];

export default function FaqPage() {
  return (
    <div className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Got questions? We’ve got answers.
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
        >
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-lg hover:no-underline text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-base">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
