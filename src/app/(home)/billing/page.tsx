
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useState } from "react";
import { getPlans, Currency } from '@/lib/plans';

type PlanKey = 'starter' | 'pro' | 'enterprise';

export default function BillingPage() {
    // In a real app, this would come from user's auth state
    const [currentPlan, setCurrentPlan] = useState<PlanKey>('starter');
    
    // For billing, we assume a fixed currency, e.g., USD, or fetch it from user settings.
    const plans = getPlans("monthly", "USD");

    const getPlanCTA = (planName: string) => {
        const planKey = planName.toLowerCase() as PlanKey;
        if (planKey === currentPlan) {
            return "Current Plan";
        }
        return "Switch Plan";
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
                <p className="text-muted-foreground">Manage your plan, payment methods, and view your invoice history.</p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the <span className="font-semibold capitalize text-primary">{currentPlan}</span> plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-sm text-muted-foreground">Manage your subscription and features below.</p>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                        <CardDescription>No payment history found.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm">Once you upgrade to a paid plan, your invoices will appear here.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="my-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold tracking-tight">Choose Your Plan</h2>
                    <p className="text-muted-foreground">Upgrade your plan to unlock more features.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {plans.map(plan => (
                        <Card key={plan.name} className="flex flex-col h-full">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <p className="text-4xl font-bold">{plan.price}<span className="text-lg font-normal text-muted-foreground">{plan.priceDetail}</span></p>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                  className="w-full" 
                                  disabled={getPlanCTA(plan.name) === "Current Plan"}
                                  onClick={() => setCurrentPlan(plan.name.toLowerCase() as PlanKey)}
                                >
                                    {getPlanCTA(plan.name)}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
