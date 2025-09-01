
import { Inter } from 'next/font/google';
import AnimatedFooter from '@/components/common/animated-footer';
import LegalHeader from './components/legal-header';

const inter = Inter({ subsets: ['latin'] });

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col min-h-screen bg-background ${inter.className}`}>
      <LegalHeader />
      <main className="flex-grow">{children}</main>
      <AnimatedFooter />
    </div>
  );
}
