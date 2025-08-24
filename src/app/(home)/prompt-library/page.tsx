
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Library, Search } from 'lucide-react';
import { PromptCard } from '@/components/prompt-library/prompt-card';
import { useAuthContext } from '@/context/auth-context';
import { useSubscription } from '@/hooks/use-subscription';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import { Loader2 } from 'lucide-react';

const placeholderPrompts = [
  {
    id: '1',
    title: "Empathetic Apology for Service Issue",
    description: "A compassionate response to a customer complaint about a service failure.",
    category: "Customer Support",
    prompt: "Acknowledge the customer's frustration with [specific_issue]. Offer a sincere apology without making excuses. Explain the immediate steps we are taking to resolve it. Offer a [goodwill_gesture] to make things right.",
    tags: ["apology", "support", "de-escalation"],
    difficulty: "Beginner",
    useCase: "Responding to unhappy customers to regain their trust.",
    rating: 4.8,
    usageCount: 1250,
  },
  {
    id: '2',
    title: "Proactive Shipping Delay Notification",
    description: "Inform a customer about a shipping delay before they ask.",
    category: "Email Templates",
    prompt: "Start by referencing their order [order_number]. Inform them proactively that their shipment is experiencing a slight delay. Provide the new estimated delivery date of [new_date]. Apologize for the inconvenience and thank them for their patience.",
    tags: ["e-commerce", "logistics", "proactive"],
    difficulty: "Beginner",
    useCase: "Managing customer expectations and reducing support tickets.",
    rating: 4.9,
    usageCount: 2340,
  },
  {
    id: '3',
    title: "Feature Benefit Explainer for Sales",
    description: "Translate a product feature into a clear benefit for a potential customer.",
    category: "Sales & Marketing",
    prompt: "The user is asking about [feature_name]. Instead of just describing it, explain how it helps them achieve [customer_goal]. Use the 'so you can...' framework. For example, 'It has a 10-hour battery, so you can work a full day without charging.'",
    tags: ["sales", "benefits", "value-prop"],
    difficulty: "Intermediate",
    useCase: "Helping sales teams close more deals by focusing on value.",
    rating: 4.7,
    usageCount: 890,
  },
  {
    id: '4',
    title: "Social Media 'How-To' Post",
    description: "A template for creating a helpful how-to guide for social media.",
    category: "Social Media",
    prompt: "Create a short, engaging social media post that teaches the audience how to [achieve_a_goal] using our [product/service]. Start with a hook. Use bullet points or numbered steps for clarity. End with a question to encourage engagement.",
    tags: ["content-creation", "social-media", "how-to"],
    difficulty: "Intermediate",
    useCase: "Creating valuable content that builds authority and engagement.",
    rating: 4.6,
    usageCount: 750,
  },
    {
    id: '5',
    title: "New Client Onboarding Welcome Email",
    description: "A comprehensive welcome email for new clients or customers.",
    category: "Business Communication",
    prompt: "Welcome the new client [client_name] to our service. Briefly reiterate the value they can expect. Outline the next three steps in the onboarding process: 1. [Step 1], 2. [Step 2], 3. [Step 3]. Provide a link to our [support_document] and let them know who to contact with questions.",
    tags: ["onboarding", "welcome-email", "client-success"],
    difficulty: "Beginner",
    useCase: "Ensuring new customers have a smooth and positive start.",
    rating: 4.9,
    usageCount: 1800,
  },
  {
    id: '6',
    title: "Product Description Enhancer",
    description: "Turn a list of product features into a compelling description.",
    category: "Product Descriptions",
    prompt: "Given the following product features for [product_name]: [feature_list]. Write a 100-word product description that focuses on the benefits for the [target_audience]. Use a [tone_of_voice] tone and include a strong call to action.",
    tags: ["copywriting", "e-commerce", "product"],
    difficulty: "Advanced",
    useCase: "Creating high-converting product pages.",
    rating: 4.8,
    usageCount: 950,
  },
];


export default function PromptLibraryPage() {
    const { user } = useAuthContext();
    const { subscription, isLoading } = useSubscription();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const isPro = subscription?.plan === 'pro' || subscription?.plan === 'enterprise';

    if(isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!isPro) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
                <h1 className="text-2xl font-bold mb-2">Unlock the Prompt Library</h1>
                <p className="text-muted-foreground mb-4 max-w-md">Access dozens of professionally crafted prompts by upgrading to a Pro plan.</p>
                <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade to Pro</Button>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-8 p-4 pt-6 md:p-8">
            {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
            <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Library className="h-7 w-7 text-primary" />
                        Prompt Library
                    </h1>
                    <p className="text-muted-foreground">Discover and use pre-built prompts for common business scenarios.</p>
                </div>
                <Badge variant="secondary" className="text-base">{placeholderPrompts.length} Prompts</Badge>
            </header>

            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search prompts..." className="pl-10" />
                </div>
                <Select>
                    <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="support">Customer Support</SelectItem>
                        <SelectItem value="sales">Sales & Marketing</SelectItem>
                        <SelectItem value="email">Email Templates</SelectItem>
                    </SelectContent>
                </Select>
                 <Select>
                    <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Sort by Popular" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="popular">Popular</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="az">A-Z</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {placeholderPrompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                ))}
            </div>
        </div>
    );
}
