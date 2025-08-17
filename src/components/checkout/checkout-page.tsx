
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowLeft } from 'lucide-react';
import { getPlans, Plan } from '@/lib/plans';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

gsap.registerPlugin(Flip);

export default function CheckoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [view, setView] = useState<'selection' | 'form' | 'success'>('selection');
    const [progress, setProgress] = useState(0);

    const plans = getPlans('monthly', 'USD');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const planName = searchParams.get('plan');
        if (planName) {
            const preselectedPlan = plans.find(p => p.name.toLowerCase() === planName.toLowerCase());
            if (preselectedPlan) {
                handleSelectPlan(preselectedPlan);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (view === 'selection') {
            const tl = gsap.timeline();
            tl.fromTo('.pricing-card', 
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, stagger: 0.2, duration: 0.8, ease: 'power3.out' }
            );
        }
    }, [view]);

    const handleSelectPlan = (plan: Plan) => {
        if (!containerRef.current) return;
        setSelectedPlan(plan);

        const state = Flip.getState('.pricing-card, .plan-title, .plan-description, .plan-price, .plan-features, .plan-button');
        
        setView('form');

        const selectedEl = document.querySelector(`[data-plan-name="${plan.name}"]`) as HTMLElement;
        const otherEls = Array.from(document.querySelectorAll('.pricing-card:not([data-plan-name="' + plan.name + '"])')) as HTMLElement[];

        gsap.to(otherEls, { opacity: 0, y: 30, duration: 0.3 });
        selectedEl.classList.add('is-selected');

        Flip.from(state, {
            duration: 0.7,
            ease: 'power3.inOut',
            onComplete: () => {
                gsap.fromTo('.checkout-form-element',
                    { opacity: 0, x: -30 },
                    { opacity: 1, x: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' }
                );
            }
        });
    };
    
    const handleGoBack = () => {
        if (!containerRef.current || !selectedPlan) return;
        
        const state = Flip.getState('.pricing-card, .plan-title, .plan-description, .plan-price, .plan-features, .plan-button');

        const selectedEl = document.querySelector(`[data-plan-name="${selectedPlan.name}"]`) as HTMLElement;
        selectedEl.classList.remove('is-selected');

        setView('selection');

        const otherEls = Array.from(document.querySelectorAll('.pricing-card:not([data-plan-name="' + selectedPlan.name + '"])')) as HTMLElement[];
        gsap.to(otherEls, { opacity: 1, y: 0, duration: 0.3, delay: 0.4 });
        
        gsap.to('.checkout-form-element', { opacity: 0, duration: 0.1 });

        Flip.from(state, {
            duration: 0.7,
            ease: 'power3.inOut',
        });
        setSelectedPlan(null);
    };

    const handleCheckout = () => {
        setProgress(100);
        gsap.to('.checkout-form', { opacity: 0, duration: 0.5 });
        setTimeout(() => {
            setView('success');
            gsap.fromTo('.success-animation', { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' });
            setTimeout(() => router.push('/dashboard'), 2000);
        }, 500);
    }
    
    return (
        <div ref={containerRef} className="w-full max-w-6xl p-4 md:p-8">
            <AnimatePresence mode="wait">
            {view === 'selection' && (
                 <motion.div key="selection" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Choose Your Plan</h1>
                        <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">Start your journey with a plan that fits your needs.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card key={plan.name} data-plan-name={plan.name} className="pricing-card bg-card/50 backdrop-blur-sm flex flex-col transition-all duration-300 hover:shadow-primary/20 hover:border-primary/50 hover:scale-105">
                                <CardHeader>
                                    <CardTitle className="plan-title text-2xl">{plan.name}</CardTitle>
                                    <CardDescription className="plan-description">{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="plan-price text-4xl font-bold mb-6">{plan.price}<span className="text-base font-normal text-muted-foreground">{plan.priceDetail}</span></p>
                                    <ul className="plan-features space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="h-5 w-5 text-accent" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <div className="p-6 pt-0">
                                    <Button onClick={() => handleSelectPlan(plan)} className="plan-button w-full transition-transform duration-200 hover:scale-105">Select Plan</Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                 </motion.div>
            )}

            {view === 'form' && selectedPlan && (
                <motion.div key="form">
                     <div data-plan-name={selectedPlan.name} className="pricing-card is-selected mx-auto">
                        <Card className="bg-card/80 backdrop-blur-sm transition-all duration-300">
                             <CardHeader className="relative">
                                <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={handleGoBack}>
                                    <ArrowLeft />
                                </Button>
                                <div className="text-center">
                                    <CardTitle className="plan-title text-2xl">Complete Your Purchase</CardTitle>
                                    <CardDescription className="plan-description">You're seconds away from unlocking the {selectedPlan.name} plan.</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="checkout-form grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="md:col-span-1 space-y-8">
                                        <div className="checkout-form-element">
                                             <Label htmlFor="name">Full Name</Label>
                                             <Input id="name" placeholder="John Doe" className="mt-2" onFocus={() => setProgress(33)} />
                                        </div>
                                        <div className="checkout-form-element">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" placeholder="john.doe@example.com" className="mt-2" onFocus={() => setProgress(66)} />
                                        </div>
                                         <div className="checkout-form-element">
                                            <Label>Payment Details</Label>
                                            <div className="mt-2 p-4 border rounded-md bg-secondary/50 flex items-center justify-center">
                                                <p className="text-muted-foreground text-sm">Stripe Payment Element would be here.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 flex flex-col justify-between p-6 bg-secondary/50 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-muted-foreground">{selectedPlan.name} Plan (Monthly)</span>
                                                <span className="font-medium">{selectedPlan.price}</span>
                                            </div>
                                             <div className="flex justify-between items-center text-muted-foreground border-b pb-2">
                                                <span>Taxes</span>
                                                <span>Calculated at next step</span>
                                            </div>
                                             <div className="flex justify-between items-center font-bold text-xl mt-4">
                                                <span>Total</span>
                                                <span>{selectedPlan.price}</span>
                                            </div>
                                        </div>
                                        <Button onClick={handleCheckout} className="w-full mt-6" size="lg">Confirm Purchase</Button>
                                    </div>
                                </div>
                                <Progress value={progress} className="mt-6 checkout-form-element" />
                            </CardContent>
                        </Card>
                    </div>
                </motion.div>
            )}

            {view === 'success' && (
                 <motion.div key="success" className="text-center p-8">
                    <div className="success-animation inline-block">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/50">
                            <Check className="h-16 w-16 text-white" strokeWidth={3} />
                        </div>
                        <h2 className="text-3xl font-bold mt-6">Payment Successful!</h2>
                        <p className="text-muted-foreground mt-2">Redirecting you to the dashboard...</p>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <style jsx>{`
                .pricing-card.is-selected {
                    width: 100%;
                    max-width: 900px; /* Adjust as needed */
                    margin: auto;
                }
            `}</style>
        </div>
    );
}

// Minimal type definition for Plan to be used within the component
interface Plan {
    name: string;
    price: string;
    priceDetail: string;
    description: string;
    features: string[];
    isPro: boolean;
    cta: string;
}
