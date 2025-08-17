
'use client';

import { useEffect, useRef } from 'react';
import { Plan } from '@/lib/plans';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface CartSummaryProps {
    plan: Plan;
    billingCycle: 'monthly' | 'yearly';
    onCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

export default function CartSummary({ plan, billingCycle, onCycleChange }: CartSummaryProps) {
    const priceRef = useRef<HTMLSpanElement>(null);
    
    useEffect(() => {
        if (priceRef.current) {
             const priceValue = parseFloat(plan.price.replace(/[^0-9.]/g, ''));
            const counter = { value: parseFloat(priceRef.current.innerText.replace(/[^0-9.]/g, '')) || 0 };

            gsap.to(counter, {
                value: priceValue,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate: () => {
                    if(priceRef.current) {
                       priceRef.current.innerText = `${plan.price.charAt(0)}${counter.value.toFixed(2)}`;
                    }
                }
            });
        }
    }, [plan.price]);
    
    return (
        <div className="bg-secondary p-6 sm:p-8 rounded-xl lg:sticky lg:top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="bg-card p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-semibold text-lg">{plan.name} Plan</h3>
                        <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                     <div className="text-right">
                        <span ref={priceRef} className="text-2xl font-bold">{plan.price}</span>
                        <p className="text-sm text-muted-foreground">{plan.priceDetail}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
                <Label htmlFor="billing-cycle" className={cn("font-medium", billingCycle === "monthly" ? "text-primary" : "text-muted-foreground")}>
                    Monthly
                </Label>
                <Switch
                    id="billing-cycle"
                    checked={billingCycle === "yearly"}
                    onCheckedChange={(checked) => onCycleChange(checked ? 'yearly' : 'monthly')}
                />
                <Label htmlFor="billing-cycle" className={cn("font-medium", billingCycle === "yearly" ? "text-primary" : "text-muted-foreground")}>
                    Yearly <span className="text-accent text-xs">(Save 20%)</span>
                </Label>
            </div>
            
            <h4 className="font-semibold mb-3">What's included:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
