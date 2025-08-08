
'use client';

import { useAuthRedirectToLogin } from '@/hooks/use-auth-redirect-to-login';
import { useAuthContext } from '@/context/auth-context';
import { Loader, LogOut, Moon, Sun, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/billing', label: 'Billing' },
    { href: '/settings', label: 'Settings' },
    { href: '/support', label: 'Support' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/home" className="mr-6 flex items-center space-x-2">
             <span className="text-lg font-bold text-primary">Savrii</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Avatar>
              <AvatarImage src={user?.photoURL || ''} />
              <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader className="p-4 border-b flex-row justify-between items-center">
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                   <Link href="/home" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
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
                    {navLinks.map(link => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            "hover:text-primary transition-colors",
                             pathname === link.href ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="p-4 border-t mt-auto">
                    <div className="flex items-center justify-between mb-4">
                        <span>Switch Theme</span>
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={user?.photoURL || ''} />
                          <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{user?.displayName || user?.email}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleLogout}>
                          <LogOut className="h-5 w-5" />
                          <span className="sr-only">Logout</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  useAuthRedirectToLogin();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // The hook will handle the redirect
  }
  
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
