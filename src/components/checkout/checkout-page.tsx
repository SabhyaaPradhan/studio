
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getPlans, Plan } from '@/lib/plans';
import { Button } from '../ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CartSummary from './cart-summary';
import { Check, Loader2 } from 'lucide-react';
import { useAuthContext } from '@/context/auth-context';

const checkoutSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(4, "ZIP code is required"),
  cardName: z.string().min(3, "Name on card is required"),
  cardNumber: z.string().length(16, "Invalid card number").regex(/^\d+$/, "Card number must be numeric"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)"),
  cvv: z.string().length(3, "Invalid CVV").regex(/^\d+$/, "CVV must be numeric"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const { user } = useAuthContext();
    const router = useRouter();
    const searchParams = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const summaryRef = useRef<HTMLDivElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const methods = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: 'onTouched',
        defaultValues: {
            fullName: user?.displayName || "",
            email: user?.email || "",
            address: "", city: "", country: "", zip: "",
            cardName: "", cardNumber: "", expiry: "", cvv: ""
        }
    });

    useEffect(() => {
        const planName = searchParams.get('plan') || 'pro';
        const plans = getPlans(billingCycle, 'USD');
        const plan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase()) || plans[1];
        setSelectedPlan(plan);
    }, [billingCycle, searchParams]);

    useEffect(() => {
        if(containerRef.current) {
            gsap.fromTo(formRef.current, 
                { opacity: 0, x: -50 },
                { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
            );
            gsap.fromTo(summaryRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
            );
        }
    }, []);

    const handleSuccessAnimation = () => {
        const tl = gsap.timeline({ onComplete: () => router.push('/dashboard') });
        const checkmark = successRef.current?.querySelector('path');

        tl.to(formRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' })
          .set(successRef.current, { display: 'flex' })
          .fromTo(successRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' });

        if (checkmark) {
            const length = checkmark.getTotalLength();
            gsap.set(checkmark, { strokeDasharray: length, strokeDashoffset: length });
            tl.to(checkmark, { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut' }, "-=0.3");
        }
    }

    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true);
        console.log("Form submitted:", data);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
        handleSuccessAnimation();
    };
    
    if (!selectedPlan) return <div className="h-screen w-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <FormProvider {...methods}>
            <div ref={containerRef} className="w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16 relative">
                    
                    {/* Success Overlay */}
                    <div ref={successRef} className="absolute inset-0 z-20 items-center justify-center bg-background/80 backdrop-blur-sm hidden">
                         <div className="flex flex-col items-center justify-center text-center p-8">
                            <svg className="w-24 h-24 text-green-500" viewBox="0 0 52 52">
                                <circle className="stroke-current opacity-20" cx="26" cy="26" r="25" fill="none" strokeWidth="2"/>
                                <path className="stroke-current" fill="none" strokeWidth="3" strokeLinecap="round" d="M14 27l5.833 5.833L38 20"/>
                            </svg>
                            <h2 className="text-3xl font-bold mt-6">Payment Successful!</h2>
                            <p className="text-muted-foreground mt-2">Redirecting to your dashboard...</p>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div ref={formRef}>
                        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-12">
                             {/* Account Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">Account Information</h3>
                                <div className="grid grid-cols-1 gap-4">
                                     <FormField control={methods.control} name="fullName" render={({ field }) => (
                                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={methods.control} name="email" render={({ field }) => (
                                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="john.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                            
                            {/* Billing Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">Billing Address</h3>
                                <div className="space-y-4">
                                    <FormField control={methods.control} name="address" render={({ field }) => (
                                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input placeholder="123 Main St" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={methods.control} name="city" render={({ field }) => (
                                            <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Anytown" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={methods.control} name="zip" render={({ field }) => (
                                            <FormItem><FormLabel>ZIP / Postal Code</FormLabel><FormControl><Input placeholder="12345" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={methods.control} name="country" render={({ field }) => (
                                        <FormItem><FormLabel>Country</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a country" /></SelectTrigger></FormControl><SelectContent><SelectItem value="us">United States</SelectItem><SelectItem value="ca">Canada</SelectItem><SelectItem value="gb">United Kingdom</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                            
                            {/* Payment Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-semibold">Payment Details</h3>
                                <div className="space-y-4">
                                    <FormField control={methods.control} name="cardName" render={({ field }) => (
                                        <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input placeholder="John M. Doe" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={methods.control} name="cardNumber" render={({ field }) => (
                                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} maxLength={16} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField control={methods.control} name="expiry" render={({ field }) => (
                                            <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={methods.control} name="cvv" render={({ field }) => (
                                            <FormItem><FormLabel>CVV</FormLabel><FormControl><Input placeholder="123" {...field} maxLength={3} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <div className="mt-4 p-3 bg-secondary/50 rounded-md text-center text-sm text-muted-foreground">This is a mock payment form. No real transaction will occur.</div>
                                </div>
                            </div>
                            
                             <Button type="submit" size="lg" className="w-full" disabled={isSubmitting || isSuccess}>
                                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</> : 'Complete Checkout'}
                            </Button>
                        </form>
                    </div>

                    {/* Summary Column */}
                    <div ref={summaryRef} className="mt-8 lg:mt-0">
                         <CartSummary plan={selectedPlan} billingCycle={billingCycle} onCycleChange={setBillingCycle} />
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}
