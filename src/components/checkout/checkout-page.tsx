
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { getPlans, Plan } from '@/lib/plans';
import CartSummary from './cart-summary';
import ProgressBar from './progress-bar';
import AccountStep from './steps/account-step';
import BillingStep from './steps/billing-step';
import PaymentStep from './steps/payment-step';
import ReviewStep from './steps/review-step';
import SuccessStep from './steps/success-step';

const stepSchemas = [
  z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    company: z.string().optional(),
  }),
  z.object({
    address: z.string().min(5, "Address is too short"),
    city: z.string().min(2, "City name is too short"),
    country: z.string().min(2, "Please select a country"),
    zip: z.string().min(4, "Invalid ZIP code"),
  }),
  z.object({
    cardName: z.string().min(3, "Name on card is required"),
    cardNumber: z.string().length(16, "Invalid card number"),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid format (MM/YY)"),
    cvv: z.string().length(3, "Invalid CVV"),
  }),
  z.object({}), // Review step
];

export type CheckoutFormData = z.infer<typeof stepSchemas[0]> &
  z.infer<typeof stepSchemas[1]> &
  z.infer<typeof stepSchemas[2]>;

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const containerRef = useRef<HTMLDivElement>(null);

    const [currentStep, setCurrentStep] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const methods = useForm<CheckoutFormData>({
        resolver: zodResolver(stepSchemas[currentStep]),
        mode: 'onChange',
        defaultValues: {
            fullName: "",
            email: "",
            company: "",
            address: "",
            city: "",
            country: "",
            zip: "",
            cardName: "",
            cardNumber: "",
            expiry: "",
            cvv: ""
        }
    });

    useEffect(() => {
        const planName = searchParams.get('plan') || 'pro';
        const plans = getPlans(billingCycle, 'USD');
        const plan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase()) || plans[1];
        setSelectedPlan(plan);
    }, [billingCycle, searchParams]);

    useEffect(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
      }
    }, []);

    const steps = [
      <AccountStep key="account" />,
      <BillingStep key="billing" />,
      <PaymentStep key="payment" />,
      <ReviewStep key="review" />,
      <SuccessStep key="success" />
    ];
    
    const handleNextStep = async () => {
      const isValid = await methods.trigger();
      if (isValid) {
        if (currentStep < steps.length - 2) { // Before last step
          setCurrentStep(currentStep + 1);
        } else {
            // Handle final submission/payment
            console.log("Submitting form...", methods.getValues());
            setCurrentStep(currentStep + 1);
        }
      }
    };

    const handlePrevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.push('/pricing');
        }
    };
    
    if (!selectedPlan) return <div className="h-screen w-full flex items-center justify-center"><p>Loading plan...</p></div>;

    const isSuccessStep = currentStep === steps.length - 1;

    if (isSuccessStep) {
      return <SuccessStep />;
    }

    return (
        <FormProvider {...methods}>
            <div ref={containerRef} className="w-full max-w-6xl mx-auto opacity-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-16">
                    {/* Left Column: Cart Summary */}
                    <CartSummary plan={selectedPlan} billingCycle={billingCycle} onCycleChange={setBillingCycle} />

                    {/* Right Column: Checkout Form */}
                    <div className="bg-card p-6 sm:p-8 rounded-xl shadow-lg mt-8 lg:mt-0">
                        <ProgressBar currentStep={currentStep} totalSteps={steps.length - 1} />
                        
                        <form onSubmit={methods.handleSubmit(handleNextStep)}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                >
                                    {steps[currentStep]}
                                </motion.div>
                            </AnimatePresence>
                             <div className="mt-8 flex justify-between items-center">
                                <button type="button" onClick={handlePrevStep} className="text-sm text-primary hover:underline">
                                    &larr; {currentStep === 0 ? 'Back to pricing' : 'Previous step'}
                                </button>
                                <button type="submit" className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
                                    {currentStep === steps.length - 2 ? 'Confirm & Pay' : 'Next Step'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </FormProvider>
    );
}
