
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What is Savrii and how does it work?",
        answer: "Savrii is an AI-powered assistant that answers your customer questions using the content you provide. Just upload your FAQs, documents, or prompts, and Savrii will handle chats, DMs, and inbox questions—automatically and 24/7."
    },
    {
        question: "Do I need to know how to code to use it?",
        answer: "No coding needed at all. Savrii is built for solo founders and small teams. You simply drag, drop, or paste your content, and Savrii starts replying like you would—without writing a single line of code."
    },
    {
        question: "Can I connect Savrii to my website or Instagram DMs?",
        answer: "Yes! Savrii can be integrated with your website, Instagram, WhatsApp, and more. Setup is simple, and we’ll walk you through it step-by-step."
    },
    {
        question: "Can I train Savrii to answer in my style?",
        answer: "Absolutely. You control the content. Upload your tone, templates, voice, and brand info. You can review, test, and improve responses any time—your AI speaks your language."
    },
    {
        question: "What kind of businesses is Savrii best for?",
        answer: "Savrii is perfect for coaches, consultants, freelancers, and e-commerce brands. If you're getting repeated questions in DMs, emails, or chat—Savrii saves you hours by replying instantly with the answers you already know."
    },
    {
        question: "Is there a free trial?",
        answer: "Yes! You can start with a free trial—no credit card required. It’s the fastest way to test Savrii on your content and see results right away."
    },
    {
        question: "Is my data secure and private?",
        answer: "100%. Your data is encrypted, and only you control what the AI sees and says. Savrii never shares your content or client information with anyone."
    }
]

export default function Faq() {
  return (
    <section id="faq" className="py-20 md:py-32 bg-background">
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
    </section>
  );
}
