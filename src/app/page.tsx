
import Header from '@/components/landing/header';
import Hero from '@/components/landing/hero';
import LogoCarousel from '@/components/landing/logo-carousel';
import ProblemSolution from '@/components/landing/problem-solution';
import HowItWorks from '@/components/landing/how-it-works';
import UseCases from '@/components/landing/use-cases';
import Testimonials from '@/components/landing/testimonials';
import Cta from '@/components/landing/cta';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Footer from '@/components/landing/footer';
import Features from '@/components/landing/features';

export default function Home() {
  return (
    <HeaderThemeProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow">
          <Hero />
          <LogoCarousel />
          <ProblemSolution />
          <HowItWorks />
          <UseCases />
          <Features />
          <Testimonials />
          <Cta />
        </main>
        <Footer />
      </div>
    </HeaderThemeProvider>
  );
}
