
import CheckoutPage from '@/components/checkout/checkout-page';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import AnimatedFooter from '@/components/common/animated-footer';
import GridBackground from '@/components/landing/grid-background';

export const metadata = {
    title: 'Checkout – Savrii AI',
    description: 'Complete your subscription to unlock the full power of Savrii AI.',
};

export default function Checkout() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
                <GridBackground />
                <Header />
                <main className="flex-grow flex items-center justify-center pt-20 z-10">
                    <CheckoutPage />
                </main>
                <AnimatedFooter />
            </div>
        </HeaderThemeProvider>
    );
}
