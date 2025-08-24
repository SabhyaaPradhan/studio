
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Copy, Send, MessageSquare, Briefcase, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  useCase: string;
  rating: number;
  usageCount: number;
}

const difficultyColors = {
  Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const categoryIcons: { [key: string]: React.ElementType } = {
  "Customer Support": MessageSquare,
  "Sales & Marketing": Briefcase,
  "Email Templates": Mail,
  "Social Media": MessageSquare,
  "Business Communication": Briefcase,
  "Product Descriptions": Briefcase,
};

export function PromptCard({ prompt }: { prompt: PromptTemplate }) {
    const { toast } = useToast();
    const router = useRouter();
    const [isFavorite, setIsFavorite] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt);
        toast({ title: "Prompt Copied!", description: "The template has been copied to your clipboard." });
    };
    
    const handleSendToChat = () => {
        const encodedPrompt = encodeURIComponent(prompt.prompt);
        router.push(`/chat?prompt=${encodedPrompt}`);
    };

    const CategoryIcon = categoryIcons[prompt.category] || Briefcase;

    return (
        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary rounded-lg"><CategoryIcon className="h-5 w-5 text-primary" /></div>
                        <CardTitle className="text-lg leading-tight">{prompt.title}</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => setIsFavorite(!isFavorite)}>
                        <Star className={cn('h-5 w-5 transition-colors', isFavorite ? 'text-yellow-400 fill-current' : 'text-muted-foreground')} />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{prompt.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className={cn('font-semibold', difficultyColors[prompt.difficulty])}>{prompt.difficulty}</Badge>
                    <span>{prompt.rating.toFixed(1)}/5.0 ★</span>
                    <span>{prompt.usageCount.toLocaleString()} uses</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {prompt.tags.slice(0, 3).map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    {prompt.tags.length > 3 && <Badge variant="secondary">+{prompt.tags.length - 3} more</Badge>}
                </div>
                <div>
                    <h4 className="text-sm font-semibold mb-1">Use Case</h4>
                    <p className="text-sm text-muted-foreground">{prompt.useCase}</p>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Prompt
                </Button>
                 <Button className="flex-1" onClick={handleSendToChat}>
                    <Send className="mr-2 h-4 w-4" /> Send to Chat
                </Button>
            </CardFooter>
        </Card>
    );
}
