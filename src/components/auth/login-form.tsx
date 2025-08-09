
"use client";

import Link from "next/link";
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
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // AuthProvider will handle success toast and redirect
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg"
    >
      <div className="text-center">
        <Link href="/" className="text-3xl font-bold text-primary">Savrii</Link>
        <h1 className="text-2xl font-bold tracking-tighter mt-4">Welcome Back</h1>
        <p className="text-muted-foreground">
          Sign in to continue to your dashboard.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                    <FormLabel>Password</FormLabel>
                    <Link href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging In..." : "Log In"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M47.532 24.555c0-1.559-.143-3.059-.411-4.494H24.388v8.48h13.01c-.563 2.756-2.186 5.119-4.64 6.702v5.505h7.076c4.145-3.822 6.55-9.423 6.55-15.845z" fill="#4285F4"></path><path d="M24.388 48c6.472 0 11.93-2.128 15.908-5.775l-7.076-5.505c-2.148 1.45-4.904 2.304-8.832 2.304-6.795 0-12.55-4.576-14.6-10.69H2.608v5.69C6.632 42.022 14.852 48 24.388 48z" fill="#34A853"></path><path d="M9.788 28.395a15.21 15.21 0 010-7.79V14.91H2.608a23.999 23.999 0 000 21.18l7.18-5.695z" fill="#FBBC05"></path><path d="M24.388 9.382c3.518 0 6.643 1.223 8.16 2.66l6.276-6.276C36.313 2.193 30.86 0 24.388 0 14.852 0 6.632 5.978 2.608 14.91l7.18 5.695c2.05-6.114 7.804-10.69 14.6-10.69z" fill="#EA4335"></path></svg>
        Google
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
