
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Home,
  MessageSquare,
  BarChart2,
  GitMerge,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  Users,
  Lock,
  ChevronDown,
  LogOut,
  Menu,
  BarChartBig,
  X,
  Wand2,
  Palette,
  BookOpen,
  Target,
  Download,
  TrendingUp,
  Workflow,
  Upload,
  Shield,
  Webhook,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useAuthRedirectToLogin } from '@/hooks/use-auth-redirect-to-login';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useState, useEffect, useRef } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTheme } from 'next-themes';
import { Sun, Moon } from "lucide-react";
import AnimatedFooter from '@/components/common/animated-footer';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { listenToUser, UserProfile, hasPermission } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';


type UserPlan = 'starter' | 'pro' | 'enterprise' | 'free';

const UpgradeTooltip = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right" align="center" className="bg-primary text-primary-foreground">
        <div className="flex flex-col items-center gap-2 p-2">
          <p className="font-semibold">Upgrade to unlock</p>
          <Button size="sm" asChild>
            <Link href="/billing">Upgrade Plan</Link>
          </Button>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const NavMenuItem = ({
  href,
  icon,
  label,
  plan,
  requiredPlan,
  isDisabled = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  plan?: UserPlan;
  requiredPlan?: 'pro' | 'enterprise';
  isDisabled?: boolean;
}) => {
  const pathname = usePathname();
  const Icon = icon;
  const isLocked = plan && requiredPlan ? !hasPermission(plan, requiredPlan) : false;
  const isEffectivelyDisabled = isDisabled || isLocked;
  const isActive = pathname === href;
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      router.push('/billing');
    }
  }

  const itemContent = (
    <SidebarMenuButton
      href={isEffectivelyDisabled ? undefined : href}
      isActive={isActive}
      className={cn(isEffectivelyDisabled && 'cursor-not-allowed opacity-60')}
      tooltip={label}
      disabled={isEffectivelyDisabled}
      onClick={isLocked ? handleClick : undefined}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1">{label}</span>
      {plan && isLocked && <Lock className="ml-auto h-3.5 w-3.5" />}
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem>
      {plan && isLocked ? <UpgradeTooltip>{itemContent}</UpgradeTooltip> : itemContent}
    </SidebarMenuItem>
  );
};


const NavMenuCollapsible = ({
  icon,
  label,
  plan,
  items,
}: {
  icon: React.ElementType;
  label: string;
  plan?: UserPlan;
  items: {
    href: string;
    label: string;
    requiredPlan?: 'pro' | 'enterprise';
    isDisabled?: boolean;
  }[];
}) => {
  const Icon = icon;
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAnyChildActive = items.some(item => pathname.startsWith(item.href));

  return (
    <SidebarMenuItem>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <button className={cn("w-full", isAnyChildActive && 'bg-secondary rounded-md')}>
              <SidebarMenuButton as="div" className={cn(isAnyChildActive && 'bg-secondary')}>
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{label}</span>
                  <ChevronDown
                    className={cn(
                      'ml-auto h-4 w-4 transition-transform duration-200',
                      isOpen ? 'rotate-180' : '',
                      state === 'collapsed' && 'hidden'
                    )}
                  />
              </SidebarMenuButton>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent asChild>
            <SidebarMenuSub>
              {items.map((item) => (
                 <NavMenuItem key={item.href} href={item.href} icon={() => <></>} label={item.label} plan={plan} requiredPlan={item.requiredPlan} isDisabled={item.isDisabled} />
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
    </SidebarMenuItem>
  );
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  useAuthRedirectToLogin();
  const { theme, setTheme } = useTheme();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
        setProfileLoading(true);
        const unsubscribe = listenToUser(user.uid, (profile) => {
             setUserProfile(profile);
             setProfileLoading(false);
        }, (err) => {
            console.error("Layout: Failed to listen to user profile.", err);
            setUserProfile(null);
            setProfileLoading(false);
        });
        return () => unsubscribe();
    } else if (!loading) {
        setUserProfile(null);
        setProfileLoading(false);
    }
  }, [user, loading]);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };


  useEffect(() => {
    if (mobileMenuOpen) {
        const ctx = gsap.context(() => {
            gsap.from("[data-mobile-nav-item]", {
                duration: 0.5,
                x: -30,
                opacity: 0,
                stagger: 0.1,
                ease: "power3.out"
            });
        }, mobileMenuRef);
        return () => ctx.revert();
    }
  }, [mobileMenuOpen]);


  if (loading || profileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  const userPlan = userProfile?.plan as UserPlan | undefined;
  
  if (!user) {
    return null; // or a loading spinner, since redirect will handle it.
  }

  const topNavItems = [
    { href: "/home", label: "Home" },
    { href: "/billing", label: "Billing" },
    { href: "/settings", label: "Settings" },
    { href: "/support", label: "Support" },
  ];

  const pathsWithoutSidebar = ['/home', '/billing', '/settings', '/support'];
  const showSidebar = !pathsWithoutSidebar.includes(pathname);

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="p-4 flex items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden">
                    <Menu className="w-6 h-6" />
                </SidebarTrigger>
                <Link href="/dashboard" className="font-semibold text-lg items-center gap-2 text-primary hidden md:flex">
                    <span>Savrii</span>
                </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {topNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-lg font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative h-9 w-9 overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={theme === 'light' ? 'moon' : 'sun'}
                            initial={{ y: -20, opacity: 0, rotate: -90 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            exit={{ y: 20, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                            className="absolute"
                        >
                            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </motion.div>
                    </AnimatePresence>
                </Button>
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || ''} />
                            <AvatarFallback>{userProfile?.first_name?.[0] || user?.email?.[0]}</AvatarFallback>
                        </Avatar>
                    </TooltipTrigger>
                    <TooltipContent align="end">
                        <div className="p-2">
                             <p className="font-semibold">{userProfile?.first_name} {userProfile?.last_name}</p>
                             <p className="text-muted-foreground text-xs">{userProfile?.email}</p>
                             <Button size="sm" variant="outline" className="w-full mt-4" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                             </Button>
                        </div>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          {showSidebar && (
            <Sidebar>
              <SidebarContent>
                <SidebarMenu>
                  <div className="p-2 mb-2">
                     <SidebarTrigger className="md:flex hidden" />
                  </div>
                    <NavMenuItem href="/home" icon={Home} label="Home" plan={userPlan} />
                    <NavMenuItem href="/dashboard" icon={BarChartBig} label="Dashboard" plan={userPlan} />
                    <NavMenuItem href="/inbox" icon={MessageSquare} label="Inbox" plan={userPlan} isDisabled />
                    <NavMenuItem href="/chat" icon={Bot} label="Chat / AI Assistant" plan={userPlan} />
                    <NavMenuItem href="/analytics" icon={BarChart2} label="Analytics" plan={userPlan} requiredPlan="pro" isDisabled />
                    <NavMenuItem href="/integrations" icon={GitMerge} label="Integrations" plan={userPlan} isDisabled />
                    <NavMenuItem href="/billing" icon={CreditCard} label="Billing" plan={userPlan} />
                    <NavMenuItem href="/settings" icon={Settings} label="Settings" plan={userPlan} />
                    <NavMenuItem href="/support" icon={HelpCircle} label="Support" plan={userPlan} />

                  <NavMenuCollapsible icon={Wand2} label="Pro Features" plan={userPlan} items={[
                      { href: "/prompts", label: "Custom Prompts", requiredPlan: "pro", isDisabled: true },
                      { href: "/brand-voice", label: "Brand Voice", requiredPlan: "pro", isDisabled: true },
                      { href: "/prompt-library", label: "Prompt Library", requiredPlan: "pro", isDisabled: true },
                      { href: "/daily-summary", label: "Daily Summary", requiredPlan: "pro", isDisabled: true },
                      { href: "/collaboration", label: "Collaboration", requiredPlan: "pro", isDisabled: true },
                      { href: "/lead-capture", label: "Lead Capture", requiredPlan: "pro", isDisabled: true },
                      { href: "/export", label: "Export Data", requiredPlan: "pro", isDisabled: true },
                  ]} />
                  
                  <NavMenuCollapsible icon={Shield} label="Enterprise" plan={userPlan} items={[
                      { href: "/real-time-analytics", label: "Real-Time Analytics", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/workflow-builder", label: "Workflow Builder", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/custom-model", label: "Custom AI Model", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/security", label: "Security", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/white-label", label: "White-label", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/webhooks", label: "Webhooks", requiredPlan: "enterprise", isDisabled: true },
                  ]} />
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
           )}
          <main className="flex-1 overflow-y-auto">
              {children}
          </main>
        </div>
        <AnimatedFooter />
      </div>
    </SidebarProvider>
  );
}
