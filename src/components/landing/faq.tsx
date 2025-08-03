import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "What kind of content can I upload?",
        answer: "You can upload various formats like PDFs, text files, or just copy-paste text. You can also provide a URL to your website, and Savrii will crawl it for information."
    },
    {
        question: "Is it difficult to set up?",
        answer: "Not at all! Savrii is designed to be no-code. The setup process is just a few clicks: upload content, customize your assistant's personality, and copy-paste a single line of code to your website."
    },
    {
        question: "Can I customize the AI assistant?",
        answer: "Yes, you have full control. You can give it a name, a personality (e.g., formal, friendly, witty), and instruct it on how to handle questions it doesn't know the answer to."
    },
    {
        question: "What platforms does it integrate with?",
        answer: "Currently, Savrii offers a web chat widget. We are actively working on integrations with platforms like WhatsApp, Shopify, Slack, and more."
    }
]

export default function Faq() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Frequently Asked Questions</h2>
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
