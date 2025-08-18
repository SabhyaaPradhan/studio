
import CheckoutPage from '@/components/checkout/checkout-page';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import AnimatedFooter from '@/components/common/animated-footer';

export const metadata = {
    title: 'Checkout – Savrii AI',
    description: 'Complete your subscription to unlock the full power of Savrii AI.',
};

export default function Checkout() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
            <header className="absolute top-0 left-0 right-0 p-4 z-20">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/pricing" className="text-2xl font-bold text-primary">Savrii</Link>
                    <Button variant="ghost" size="sm" asChild>
                       <Link href="/pricing">
                         <Lock className="mr-2 h-4 w-4" /> Secure Checkout
                       </Link>
                    </Button>
                </div>
            </header>
            <main className="flex-grow flex items-center justify-center z-10 pt-20 pb-10">
                <CheckoutPage />
            </main>
            <AnimatedFooter />
        </div>
    );
}
