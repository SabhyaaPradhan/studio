
import AnimatedFooter from '@/components/common/animated-footer';
import Header from '@/components/landing/header';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';

export const metadata = {
    title: 'Features – Savrii AI',
    description: 'Explore all the features that make Savrii the most powerful AI assistant for automating your business. From AI email writing to workflow automation, see how we help you scale smarter.',
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HeaderThemeProvider>
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <AnimatedFooter />
        </div>
    </HeaderThemeProvider>
  );
}
