
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "For individuals getting started.",
        features: ["100 AI Replies/mo", "1 Knowledge Source", "Basic Support"],
        cta: "Current Plan"
    },
    {
        name: "Starter",
        price: "$29",
        description: "For small teams and startups.",
        features: ["1,500 AI Replies/mo", "5 Knowledge Sources", "Priority Support"],
        cta: "Upgrade"
    },
    {
        name: "Pro",
        price: "$99",
        description: "For growing businesses.",
        features: ["5,000 AI Replies/mo", "Unlimited Sources", "Analytics & Reporting"],
        cta: "Upgrade"
    }
];

export default function BillingPage() {
    return (
        <div className="container mx-auto max-w-5xl py-8 px-4">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Billing</h1>
            <p className="text-muted-foreground mb-8">Manage your plan, payment methods, and view your invoice history.</p>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Current Plan</CardTitle>
                        <CardDescription>You are currently on the <span className="font-semibold text-primary">Free</span> plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-2 font-semibold">Usage:</p>
                        <div className="space-y-2">
                            <p className="text-sm">AI Replies: 45 / 100</p>
                            <div className="w-full bg-secondary rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{width: '45%'}}></div>
                            </div>
                        </div>
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

            <div className="my-12">
                <h2 className="text-2xl font-bold tracking-tight text-center mb-2">Choose Your Plan</h2>
                <p className="text-muted-foreground text-center mb-8">Upgrade your plan to unlock more features.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <Card key={plan.name} className="flex flex-col">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <p className="text-4xl font-bold">{plan.price}<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <ul className="space-y-3">
                                    {plan.features.map(feature => (
                                        <li key={feature} className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-500" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" disabled={plan.cta === "Current Plan"}>
                                    {plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
