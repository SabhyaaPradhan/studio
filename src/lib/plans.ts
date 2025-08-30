

export interface Plan {
    name: string;
    price: string;
    priceDetail: string;
    description: string;
    features: string[];
    isPro: boolean;
    cta: string;
}

export const basePrices = {
    monthly: { pro: 29, enterprise: 99 },
    yearly: { pro: 290, enterprise: 990 },
};

export const currencies = {
    USD: { symbol: "$", rate: 1, name: "USD" },
    EUR: { symbol: "€", rate: 0.93, name: "EUR" },
    GBP: { symbol: "£", rate: 0.79, name: "GBP" },
    INR: { symbol: "₹", rate: 83.5, name: "INR" },
};

export type Currency = keyof typeof currencies;

export const getPlans = (billingCycle: "monthly" | "yearly", currency: Currency): Plan[] => {
    const { symbol, rate } = currencies[currency];
    const formatPrice = (price: number) => {
        return `${symbol}${Math.round(price * rate)}`;
    }

    const plans: Plan[] = [
        {
            name: "Starter",
            price: "$0",
            priceDetail: "/month",
            description: "For individuals getting started.",
            features: [
                "100 queries / month",
                "Basic AI responses",
                "Email support",
                "1 integration",
                "Basic analytics",
            ],
            isPro: false,
            cta: "Current Plan",
        },
        {
            name: "Pro",
            price: "",
            priceDetail: "",
            description: "For small teams and startups.",
            features: [
                "Unlimited queries",
                "Advanced AI responses",
                "Priority support",
                "All integrations",
                "Advanced analytics",
                "Custom prompts",
                "Brand voice training",
            ],
            isPro: true,
            cta: "Upgrade",
        },
        {
            name: "Enterprise",
            price: "",
            priceDetail: "",
            description: "For growing businesses and agencies.",
            features: [
                "Unlimited queries",
                "Premium AI responses",
                "24/7 phone support",
                "All integrations",
                "Real-time analytics",
                "Custom prompts",
                "Brand voice training",
                "API access",
                "White-label options",
            ],
            isPro: false,
            cta: "Upgrade",
        },
    ];
    
    if (billingCycle === 'yearly') {
        plans[1].price = formatPrice(basePrices.yearly.pro);
        plans[2].price = formatPrice(basePrices.yearly.enterprise);
        plans[1].priceDetail = '/year';
        plans[2].priceDetail = '/year';
    } else {
        plans[1].price = formatPrice(basePrices.monthly.pro);
        plans[2].price = formatPrice(basePrices.monthly.enterprise);
        plans[1].priceDetail = '/month';
        plans[2].priceDetail = '/month';
    }

    return plans;
};

export const allFeatures = [
    { name: "Queries", starter: "100 / month", pro: "Unlimited", enterprise: "Unlimited" },
    { name: "AI responses", starter: "Basic", pro: "Advanced", enterprise: "Premium" },
    { name: "Support", starter: "Email support", pro: "Priority support", enterprise: "24/7 phone support" },
    { name: "Integrations", starter: "1", pro: "All", enterprise: "All" },
    { name: "Custom Prompts", starter: false, pro: true, enterprise: true },
    { name: "Brand Voice Training", starter: false, pro: true, enterprise: true },
    { name: "API Access", starter: false, pro: false, enterprise: true },
    { name: "White-label Options", starter: false, pro: false, enterprise: true },
];

export const faqs = [
    {
        question: "Do I need a credit card to start with the free plan?",
        answer: "No, you can start for free without adding a credit card."
    },
    {
        question: "What happens if I exceed my free plan limits?",
        answer: "You’ll be prompted to upgrade to Pro to continue using AI Email Writer and Chatbot without interruptions."
    },
    {
        question: "What are webhooks, and who can use them?",
        answer: "Webhooks let you receive real-time event data directly to your system. Available only on the Enterprise plan."
    },
    {
        question: "Can I upgrade or downgrade my plan anytime?",
        answer: "Yes, you can switch plans anytime from the dashboard. Your usage and data will remain intact."
    },
    {
        question: "Do you offer refunds?",
        answer: "We do not offer refunds, but you can cancel anytime, and your plan will remain active until the end of the billing cycle."
    },
];
