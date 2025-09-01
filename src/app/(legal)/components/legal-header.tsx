
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LegalHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClasses = (href: string) =>
    cn(
      'transition-colors hover:text-primary',
      pathname === href ? 'text-primary font-semibold' : 'text-muted-foreground'
    );

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-sm shadow-md h-16'
          : 'bg-background h-20'
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-xl font-bold text-primary">
          Savrii
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/terms-of-service" className={navLinkClasses('/terms-of-service')}>
            Terms
          </Link>
          <Link href="/privacy-policy" className={navLinkClasses('/privacy-policy')}>
            Privacy
          </Link>
        </nav>
      </div>
    </header>
  );
}
