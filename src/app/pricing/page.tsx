
import PricingPage from '@/components/pricing/pricing-page';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import AnimatedFooter from '@/components/common/animated-footer';

export const metadata = {
    title: 'Savrii – Smart AI for Customer Communication | Pricing',
    description: 'Choose the perfect Savrii plan for your business. Compare features, integrations, and support across Free, Pro, and Enterprise plans.',
};

export default function Pricing() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow pt-20">
                    <PricingPage />
                </main>
                <AnimatedFooter />
            </div>
        </HeaderThemeProvider>
    );
}
