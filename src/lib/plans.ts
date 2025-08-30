

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
        question: "Can I change my plan later?",
        answer: "Yes, you can upgrade, downgrade, or cancel your plan at any time from your account dashboard. Changes will be prorated."
    },
    {
        question: "Is there a discount for non-profits or students?",
        answer: "We offer special discounts for non-profit organizations and educational institutions. Please contact our support team to learn more about our programs."
    },
    {
        question: "What counts as an 'AI query'?",
        answer: "An AI query is counted every time Savrii processes and responds to a user's question or message. This includes chats, emails, and DMs handled by the assistant."
    },
    {
        question: "What happens if I go over my monthly query limit on the Starter plan?",
        answer: "If you exceed your monthly query limit on the Starter plan, your AI assistant will be temporarily paused until the next billing cycle. You'll receive notifications as you approach your limit and can upgrade to the Pro plan for unlimited queries at any time."
    }
];
