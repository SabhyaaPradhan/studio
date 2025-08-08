
'use client';

import { useAuthRedirectToLogin } from '@/hooks/use-auth-redirect-to-login';
import { useAuthContext } from '@/context/auth-context';
import { Loader, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from "next-themes";
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

function Header() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/billing', label: 'Billing' },
    { href: '/dashboard/settings', label: 'Settings' },
    { href: '/dashboard/faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
             <span className="text-lg font-bold text-primary">Savrii</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
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
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
}

export default function DashboardLayout({
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
