import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import ProblemSolution from '@/components/landing/problem-solution';
import HowItWorks from '@/components/landing/how-it-works';
import UseCases from '@/components/landing/use-cases';
import Features from '@/components/landing/features';
import Testimonials from '@/components/landing/testimonials';
import Faq from '@/components/landing/faq';
import Cta from '@/components/landing/cta';
import Footer from '@/components/landing/footer';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';

export default function Home() {
  return (
    <HeaderThemeProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
          <Hero />
          <ProblemSolution />
          <HowItWorks />
          <UseCases />
          <Features />
          <Testimonials />
          <Faq />
          <Cta />
        </main>
        <Footer />
      </div>
    </HeaderThemeProvider>
  );
}
