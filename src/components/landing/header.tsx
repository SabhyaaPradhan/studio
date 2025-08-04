
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sun, Moon, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Savrii</span>
        </Link>

        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-lg font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
        </nav>

        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        )}

        <div className="md:hidden flex items-center gap-2">
           <Button variant="ghost" size="icon" onClick={toggleTheme} className={cn(isAuthPage && "hidden")}>
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
           </Button>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <SheetHeader className="p-4 border-b flex-row justify-between items-center">
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                 <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <span className="text-2xl font-bold text-primary">Savrii</span>
                 </Link>
                 <SheetClose asChild>
                    <Button variant="ghost" size="icon">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                 </SheetClose>
              </SheetHeader>
              <div className="flex flex-col h-full">
                <nav className="flex flex-col gap-6 p-4 text-lg font-medium flex-grow">
                  <SheetClose asChild><Link href="/" className="hover:text-primary transition-colors">Home</Link></SheetClose>
                  <SheetClose asChild><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></SheetClose>
                  <SheetClose asChild><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></SheetClose>
                  <SheetClose asChild><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></SheetClose>
                </nav>
                <div className="p-4 border-t mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span>Switch Theme</span>
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                    </div>
                    {!isAuthPage && (
                      <div className="flex flex-col gap-4">
                          <SheetClose asChild>
                            <Button variant="ghost" asChild>
                              <Link href="/login">Sign In</Link>
                            </Button>
                          </SheetClose>
                          <SheetClose asChild>
                            <Button asChild>
                              <Link href="/signup">Get Started</Link>
                            </Button>
                          </SheetClose>
                      </div>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
