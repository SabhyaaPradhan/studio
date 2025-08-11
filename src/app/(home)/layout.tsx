

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
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
import { listenToUser, UserProfile } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';


type UserPlan = 'starter' | 'pro' | 'enterprise' | 'free';

const hasPermission = (
  plan: UserPlan,
  requiredPlan: 'pro' | 'enterprise'
) => {
  if (requiredPlan === 'pro') {
    return plan === 'pro' || plan === 'enterprise';
  }
  if (requiredPlan === 'enterprise') {
    return plan === 'enterprise';
  }
  return true;
};

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
  isSubItem = false,
  isDisabled = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  plan?: UserPlan;
  requiredPlan?: 'pro' | 'enterprise';
  isSubItem?: boolean;
  isDisabled?: boolean;
}) => {
  const pathname = usePathname();
  const Icon = icon;
  const isLocked = plan && requiredPlan ? !hasPermission(plan, requiredPlan) : false;
  const isEffectivelyDisabled = isDisabled || !plan; // Disable if no plan is loaded yet or explicitly disabled
  const isActive = pathname === href;

  const itemContent = (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className={cn('h-10', isLocked || isEffectivelyDisabled ? 'cursor-not-allowed opacity-60' : '')}
      tooltip={label}
      disabled={isLocked || isEffectivelyDisabled}
    >
      <Link href={isLocked || isEffectivelyDisabled ? '#' : href}>
        <Icon className="h-5 w-5" />
        <span className="flex-1">{label}</span>
        {plan && isLocked && <Lock className="ml-auto h-3.5 w-3.5" />}
      </Link>
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className={cn("h-10", isAnyChildActive && 'bg-secondary')}>
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
            <ChevronDown
              className={cn(
                'ml-auto h-4 w-4 transition-transform duration-200',
                isOpen ? 'rotate-180' : '',
                state === 'collapsed' && 'hidden'
              )}
            />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent asChild>
        <SidebarMenuSub>
          {items.map((item) => (
             <NavMenuItem
                key={item.href}
                href={item.href}
                icon={() => <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/80 group-hover:bg-foreground" />}
                label={item.label}
                plan={plan}
                requiredPlan={item.requiredPlan}
                isDisabled={item.isDisabled}
                isSubItem
              />
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
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

  const pagesWithSidebar = ['/dashboard', '/chat', '/analytics', '/integrations', '/custom-prompts', '/brand-voice', '/prompt-library', '/daily-summary', '/collaboration', '/lead-capture', '/export', '/real-time-analytics', '/api-access', '/workflow-builder', '/custom-model', '/security', '/white-label', '/webhooks'];
  const shouldShowSidebar = pagesWithSidebar.includes(pathname);

  // MOCK: In a real app, this would come from your user's data
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
        const unsubscribe = listenToUser(user.uid, (profile) => {
             setUserProfile(profile);
        }, (err) => {
            console.error("Layout: Failed to listen to user profile.", err);
            setUserProfile(null);
        });
        return () => unsubscribe();
    } else {
        setUserProfile(null);
    }
  }, [user]);


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


  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  const navLinks = [
      { href: "/home", label: "Home", icon: Home },
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/settings", label: "Settings", icon: Settings },
      { href: "/support", label: "FAQ", icon: HelpCircle },
  ];

  const userPlan = userProfile?.plan as UserPlan | undefined;

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="p-4 flex items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 border-b">
            <div className="flex items-center gap-2">
                {shouldShowSidebar ? (
                    <SidebarTrigger className="md:hidden">
                        <Menu className="w-6 h-6" />
                    </SidebarTrigger>
                ) : (
                    <Link href="/dashboard" className="font-semibold text-lg flex items-center gap-2 text-primary">
                       <span>Savrii</span>
                    </Link>
                )}
                 {shouldShowSidebar && (
                    <Link href="/dashboard" className="font-semibold text-lg items-center gap-2 text-primary hidden md:flex">
                        <span>Savrii</span>
                    </Link>
                )}
            </div>
            <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-base font-medium">
                {navLinks.map(link => (
                    <Link key={link.href} href={link.href} className={cn(
                        "transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
                    )}>
                        {link.label}
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
                        <Button variant="ghost" size="icon" className="h-9 w-9 hidden md:inline-flex" onClick={handleLogout}>
                            <LogOut className="h-4 w-4"/>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent align="end">Logout</TooltipContent>
                </Tooltip>
                </TooltipProvider>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback>{userProfile?.first_name?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent ref={mobileMenuRef}>
                        <SheetHeader className="flex flex-row justify-between items-center border-b pb-4 px-4">
                            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                <span className="text-xl font-bold text-primary">Savrii</span>
                            </Link>
                            <SheetClose asChild>
                                <Button variant="ghost" size="icon">
                                    <X className="h-6 w-6" />
                                </Button>
                            </SheetClose>
                        </SheetHeader>
                        <nav className="flex flex-col gap-2 mt-8 p-4">
                            {navLinks.map(link => (
                                <div key={link.href} data-mobile-nav-item>
                                    <SheetClose asChild>
                                        <Link href={link.href} className={cn(
                                            "flex items-center gap-4 text-lg p-3 rounded-lg transition-colors hover:bg-secondary",
                                            pathname === link.href ? "bg-secondary text-primary font-semibold" : "text-muted-foreground"
                                        )}>
                                            <link.icon className="h-5 w-5" />
                                            {link.label}
                                        </Link>
                                    </SheetClose>
                                </div>
                            ))}
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
        <div className="flex flex-1">
          {shouldShowSidebar && (
            <Sidebar>
              <SidebarContent>
                <SidebarMenu>
                  <div className="p-2 mb-2">
                     <SidebarTrigger className="md:flex hidden" />
                  </div>

                  <NavMenuItem href="/dashboard" icon={BarChartBig} label="Dashboard" plan={userPlan} />
                  <NavMenuItem href="/chat" icon={MessageSquare} label="Chat / AI Assistant" plan={userPlan} isDisabled={true} />
                  <NavMenuItem href="/analytics" icon={BarChart2} label="Analytics" plan={userPlan} requiredPlan="pro" />
                  <NavMenuItem href="/integrations" icon={GitMerge} label="Integrations" plan={userPlan} />
                  
                  <NavMenuCollapsible icon={FileText} label="Content Mgmt" plan={userPlan} items={[
                      { href: "/custom-prompts", label: "Custom Prompts", requiredPlan: "pro" },
                      { href: "/brand-voice", label: "Brand Voice Training", requiredPlan: "pro" },
                      { href: "/prompt-library", label: "Prompt Library", requiredPlan: "pro", isDisabled: true },
                  ]} />
                  
                  <NavMenuCollapsible icon={Users} label="Productivity" plan={userPlan} items={[
                      { href: "/daily-summary", label: "Daily Summary", requiredPlan: "pro", isDisabled: true },
                      { href: "/collaboration", label: "Collaboration Tools", requiredPlan: "pro", isDisabled: true },
                      { href: "/lead-capture", label: "Lead Capture Options", requiredPlan: "pro", isDisabled: true },
                      { href: "/export", label: "Export Conversations", requiredPlan: "pro", isDisabled: true },
                  ]} />

                  <NavMenuCollapsible icon={Settings} label="Advanced" plan={userPlan} items={[
                      { href: "/real-time-analytics", label: "Real-Time Analytics", requiredPlan: "enterprise" },
                      { href: "/api-access", label: "API Access", requiredPlan: "enterprise" },
                      { href: "/workflow-builder", label: "Workflow Builder", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/custom-model", label: "Custom AI Model", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/security", label: "Security & Compliance", requiredPlan: "enterprise", isDisabled: true },
                      { href: "/white-label", label: "White-label Settings", requiredPlan: "enterprise" },
                      { href: "/webhooks", label: "Webhooks & Zapier", requiredPlan: "enterprise", isDisabled: true },
                  ]} />
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter>
                  <div className='px-4 py-2 text-sm'>
                      <p className='font-semibold'>Current Plan</p>
                      {userProfile ? (
                        <p className='text-muted-foreground capitalize'>{userProfile.plan}</p>
                      ) : (
                        <Skeleton className="h-4 w-20 mt-1" />
                      )}
                  </div>
                  <SidebarMenu>
                    <NavMenuItem href="/billing" icon={CreditCard} label="Billing" plan={userPlan} />
                    <NavMenuItem href="/settings" icon={Settings} label="Settings" plan={userPlan} />
                    <NavMenuItem href="/support" icon={HelpCircle} label="Support" plan={userPlan} />
                  </SidebarMenu>
                <TooltipProvider>
                    <div className="flex items-center gap-3 p-3 rounded-lg border m-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || ''} />
                            <AvatarFallback>{userProfile?.first_name?.[0] || user?.email?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                           {userProfile ? (
                                <>
                                    <p className="text-sm font-semibold truncate">{userProfile.first_name} {userProfile.last_name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{userProfile.email}</p>
                                </>
                           ) : (
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-full" />
                                </div>
                           )}
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">Logout</TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>
              </SidebarFooter>
            </Sidebar>
          )}
          <main className="flex-1 overflow-y-auto">
              {children}
          </main>
        </div>
      </div>
      <AnimatedFooter />
    </SidebarProvider>
  );
}
