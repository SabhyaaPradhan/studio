
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Mail, Phone, Clock, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

async function handleFormSubmission(values: z.infer<typeof formSchema>) {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.detail || result.message || "Something went wrong.");
        }

        return { success: true };
    } catch (error) {
        console.error("Submission error:", error);
        // Forward the error message to be displayed in the toast
        return { success: false, error: (error as Error).message };
    }
}


export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const result = await handleFormSubmission(values);
    setIsSubmitting(false);

    if (result.success) {
      toast({
        title: "Message Sent! 🎉",
        description: "Thanks! We’ll get back to you within 24 hours.",
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: result.error || "There was a problem with your request. Please try again.",
      });
    }
  }

  return (
    <div className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">Contact Us</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We're here to help you automate smarter.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-16">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="md:col-span-2"
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a reason for contacting us" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="sales">Sales Inquiry</SelectItem>
                                  <SelectItem value="support">Customer Support</SelectItem>
                                  <SelectItem value="demo">Request a Demo</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Tell us how we can help..."
                                className="min-h-[150px]"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                    </form>
                </Form>
            </motion.div>
             <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-8"
            >
                <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Contact Information</h3>
                    <div className="flex items-center gap-4">
                        <Mail className="h-6 w-6 text-primary"/>
                        <a href="mailto:savriiofficial@gmail.com" className="hover:underline">savriiofficial@gmail.com</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Clock className="h-6 w-6 text-primary"/>
                        <span>Mon - Fri, 9am - 5pm EST</span>
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="text-2xl font-semibold">Follow Us</h3>
                    <div className="flex items-center gap-4">
                       <a href="#" className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors">
                           <Twitter className="h-6 w-6 text-primary"/>
                       </a>
                       <a href="#" className="p-2 rounded-full bg-secondary hover:bg-primary/20 transition-colors">
                           <Linkedin className="h-6 w-6 text-primary"/>
                       </a>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
