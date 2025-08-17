
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  LogOut,
  Menu,
  Sun,
  Moon,
  Home,
  CreditCard,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { User } from 'firebase/auth';
import type { UserProfile } from '@/services/user-service';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface SimpleHeaderProps {
  user: User | null;
  userProfile: UserProfile | null;
}

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/billing', label: 'Billing', icon: CreditCard },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/support', label: 'Support', icon: HelpCircle },
];

export function SimpleHeader({ user, userProfile }: SimpleHeaderProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const NavLink = ({
    href,
    children,
    isMobile = false,
    icon: Icon,
  }: {
    href: string;
    children: React.ReactNode;
    isMobile?: boolean;
    icon: React.ElementType;
  }) => (
    <SheetClose asChild={isMobile}>
      <Link
        href={href}
        className={cn(
          'transition-colors hover:text-primary',
          isMobile
            ? 'flex items-center gap-4 p-2 rounded-md text-lg'
            : 'text-sm font-medium',
          pathname === href
            ? 'text-primary'
            : 'text-muted-foreground'
        )}
      >
        {isMobile && <Icon className="h-5 w-5" />}
        <span>{children}</span>
      </Link>
    </SheetClose>
  );

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <Link
        href="/home"
        className="flex items-center gap-2 text-lg font-semibold text-primary"
      >
        <span>Savrii</span>
      </Link>

      <nav className="hidden items-center gap-6 md:flex">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href} icon={item.icon}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative h-9 w-9 overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={theme === 'light' ? 'moon' : 'sun'}
              initial={{ y: -20, opacity: 0, rotate: -90 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              exit={{ y: 20, opacity: 0, rotate: 90 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </motion.div>
          </AnimatePresence>
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback>
                  {userProfile?.first_name?.[0] || user?.email?.[0]}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent align="end">
              <div className="p-2">
                <p className="font-semibold">
                  {userProfile?.first_name} {userProfile?.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userProfile?.email}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    isMobile
                    icon={item.icon}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
