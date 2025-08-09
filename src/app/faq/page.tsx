
import FaqPage from '@/components/faq/faq-page';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import AnimatedFooter from '@/components/common/animated-footer';
import Cta from '@/components/landing/cta';

export const metadata = {
    title: 'Frequently Asked Questions – Savrii AI',
    description: "Got questions? We’ve got answers. Find everything you need to know about Savrii's AI assistant.",
};

export default function FAQ() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow pt-20">
                    <FaqPage />
                    <Cta />
                </main>
                <AnimatedFooter />
            </div>
        </HeaderThemeProvider>
    );
}
