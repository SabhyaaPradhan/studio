
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
  SidebarFooter
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
  Bot,
  LayoutDashboard,
  MessageCircle,
  BarChart3,
  Zap,
  Paintbrush
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
import { motion, AnimatePresence } from 'framer-motion';
import { listenToUser, UserProfile } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';


type UserPlan = 'starter' | 'pro' | 'enterprise' | 'free';

const hasPermission = (plan: UserPlan, requiredPlan: 'pro' | 'enterprise') => {
    if (plan === 'enterprise') return true;
    if (plan === 'pro' && requiredPlan === 'pro') return true;
    return false;
}

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
  href?: string;
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
  const isActive = !!(href && pathname === href);
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
    icon: React.ElementType;
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
                <SidebarMenuButton as="button" className={cn('w-full', isAnyChildActive && 'bg-secondary')}>
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
            </CollapsibleTrigger>
            <CollapsibleContent>
                <SidebarMenuSub>
                {items.map((item) => (
                    <NavMenuItem key={item.href} href={item.href} icon={item.icon} label={item.label} plan={plan} requiredPlan={item.requiredPlan} isDisabled={item.isDisabled} />
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

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

  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link
      href={href}
      className={cn(
        "text-lg font-medium transition-colors hover:text-primary",
        pathname === href ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger
              className={cn('md:hidden')}
            >
              <Menu className="w-6 h-6" />
            </SidebarTrigger>
            <Link
              href="/dashboard"
              className="hidden items-center gap-2 text-lg font-semibold text-primary md:flex"
            >
              <span>Savrii</span>
            </Link>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            {topNavItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
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
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                {/* --- Main Sidebar Nav --- */}
                { showSidebar && (
                  <>
                    <NavMenuItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" plan={userPlan} />
                    <NavMenuItem href="/inbox" icon={MessageCircle} label="Inbox" plan={userPlan} isDisabled />
                    <NavMenuItem href="/chat" icon={Bot} label="Chat / AI Assistant" plan={userPlan} />
                    <NavMenuItem href="/analytics" icon={BarChart3} label="Analytics" plan={userPlan} requiredPlan="pro" isDisabled />
                    <NavMenuItem href="/integrations" icon={Zap} label="Integrations" plan={userPlan} isDisabled />
                  
                    <NavMenuCollapsible icon={Wand2} label="Pro Features" plan={userPlan} items={[
                        { href: "/prompts", label: "Custom Prompts", icon: Wand2, requiredPlan: "pro", isDisabled: true },
                        { href: "/brand-voice", label: "Brand Voice", icon: Palette, requiredPlan: "pro", isDisabled: true },
                        { href: "/prompt-library", label: "Prompt Library", icon: BookOpen, requiredPlan: "pro", isDisabled: true },
                        { href: "/daily-summary", label: "Daily Summary", icon: FileText, requiredPlan: "pro", isDisabled: true },
                        { href: "/collaboration", label: "Collaboration", icon: Users, requiredPlan: "pro", isDisabled: true },
                        { href: "/lead-capture", label: "Lead Capture", icon: Target, requiredPlan: "pro", isDisabled: true },
                        { href: "/export", label: "Export Data", icon: Download, requiredPlan: "pro", isDisabled: true },
                    ]} />
                  
                    <NavMenuCollapsible icon={Shield} label="Enterprise" plan={userPlan} items={[
                        { href: "/real-time-analytics", label: "Real-Time Analytics", icon: TrendingUp, requiredPlan: "enterprise", isDisabled: true },
                        { href: "/workflow-builder", label: "Workflow Builder", icon: Workflow, requiredPlan: "enterprise", isDisabled: true },
                        { href: "/custom-model", label: "Custom AI Model", icon: Upload, requiredPlan: "enterprise", isDisabled: true },
                        { href: "/security", label: "Security", icon: Shield, requiredPlan: "enterprise", isDisabled: true },
                        { href: "/white-label", label: "White-label", icon: Paintbrush, requiredPlan: "enterprise", isDisabled: true },
                        { href: "/webhooks", label: "Webhooks", icon: Webhook, requiredPlan: "enterprise", isDisabled: true },
                    ]} />
                  </>
                )}

                {/* --- Mobile Nav (from top bar) --- */}
                <div className="md:hidden">
                  
                  <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</p>
                  <div className="mt-2 flex flex-col gap-1">
                    <NavMenuItem href="/home" icon={Home} label="Home" plan={userPlan} />
                    <NavMenuItem href="/billing" icon={CreditCard} label="Billing" plan={userPlan} />
                  </div>
                </div>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <NavMenuItem
                  href="/settings"
                  icon={Settings}
                  label="Settings"
                  plan={userPlan}
                />
                <NavMenuItem
                  href="/support"
                  icon={HelpCircle}
                  label="Support"
                  plan={userPlan}
                />
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <main className={cn("flex-1 overflow-y-auto", !showSidebar && "w-full")}>{children}</main>
        </div>
        <AnimatedFooter />
      </div>
    </SidebarProvider>
  );
}
