
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
  SidebarFooter,
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
  Paintbrush,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
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
import { Sun, Moon } from 'lucide-react';
import AnimatedFooter from '@/components/common/animated-footer';
import { motion, AnimatePresence } from 'framer-motion';
import { listenToUser, UserProfile } from '@/services/user-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { SimpleHeader } from '@/components/common/simple-header';
import { UpgradeModal } from '@/components/common/upgrade-modal';
import type { Subscription } from '@/services/user-service';


type UserPlan = 'starter' | 'pro' | 'enterprise';

const hasPermission = (plan: UserPlan, requiredPlan: 'pro' | 'enterprise') => {
  if (plan === 'enterprise') return true;
  if (plan === 'pro' && requiredPlan === 'pro') return true;
  return false;
};

const NavMenuItem = ({
  href,
  icon,
  label,
  plan,
  requiredPlan,
  isDisabled = false,
  onLockClick,
}: {
  href?: string;
  icon: React.ElementType;
  label: string;
  plan?: UserPlan;
  requiredPlan?: 'pro' | 'enterprise';
  isDisabled?: boolean;
  onLockClick: () => void;
}) => {
  const pathname = usePathname();
  const Icon = icon;
  const isLocked = plan && requiredPlan ? !hasPermission(plan, requiredPlan) : false;
  const isEffectivelyDisabled = isDisabled || isLocked;
  const isActive = !!(href && pathname.startsWith(href));

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      e.preventDefault();
      onLockClick();
    }
  };

  const itemContent = (
    <SidebarMenuButton
      href={href}
      isActive={isActive}
      className={cn(isEffectivelyDisabled && 'cursor-not-allowed opacity-60')}
      tooltip={label}
      disabled={isDisabled}
      onClick={handleClick}
    >
      <Icon className="h-5 w-5" />
      <span className="flex-1">{label}</span>
      {plan && isLocked && <Lock className="ml-auto h-3.5 w-3.5" />}
    </SidebarMenuButton>
  );

  return <SidebarMenuItem>{itemContent}</SidebarMenuItem>;
};

const NavMenuCollapsible = ({
  icon,
  label,
  plan,
  items,
  onLockClick
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
  onLockClick: () => void;
}) => {
  const Icon = icon;
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAnyChildActive = items.some((item) => pathname.startsWith(item.href));

  return (
    <SidebarMenuItem>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            as="button"
            className={cn('w-full', isAnyChildActive && 'bg-secondary')}
          >
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
              <NavMenuItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                plan={plan}
                requiredPlan={item.requiredPlan}
                isDisabled={item.isDisabled}
                onLockClick={onLockClick}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

const FullLayout = ({
  user,
  subscription,
  children,
}: {
  user: any;
  subscription: Subscription | null;
  children: React.ReactNode;
}) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const userPlan = subscription?.plan as UserPlan | undefined;

  return (
    <SidebarProvider>
      {isUpgradeModalOpen && <UpgradeModal onOpenChange={setIsUpgradeModalOpen} />}
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-primary"
            >
              <span>Savrii</span>
            </Link>
          </div>

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
                      {user?.displayName?.[0] || user?.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent align="end">
                  <div className="p-2">
                    <p className="font-semibold">
                      {user?.displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
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
              <SidebarTrigger>
                <Menu className="w-6 h-6" />
              </SidebarTrigger>
            </div>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <NavMenuItem
                  href="/dashboard"
                  icon={LayoutDashboard}
                  label="Dashboard"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
                <NavMenuItem
                  href="/inbox"
                  icon={MessageCircle}
                  label="Inbox"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
                <NavMenuItem
                  href="/chat"
                  icon={Bot}
                  label="Chat / AI Assistant"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
                <NavMenuItem
                  href="/analytics"
                  icon={BarChart3}
                  label="Analytics"
                  plan={userPlan}
                  requiredPlan="pro"
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
                <NavMenuItem
                  href="/integrations"
                  icon={Zap}
                  label="Integrations"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
                <NavMenuItem
                  href="/prompts"
                  icon={FileText}
                  label="Groups / Prompts"
                  plan={userPlan}
                  requiredPlan="pro"
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />

                <NavMenuCollapsible
                  icon={Wand2}
                  label="Pro Features"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                  items={[
                    {
                      href: '/brand-voice',
                      label: 'Brand Voice',
                      icon: Palette,
                      requiredPlan: 'pro',
                    },
                    {
                      href: '/prompt-library',
                      label: 'Prompt Library',
                      icon: BookOpen,
                      requiredPlan: 'pro',
                    },
                    {
                      href: '/daily-summary',
                      label: 'Daily Summary',
                      icon: FileText,
                      requiredPlan: 'pro',
                    },
                    {
                      href: '/collaboration',
                      label: 'Collaboration',
                      icon: Users,
                      requiredPlan: 'pro',
                    },
                    {
                      href: '/lead-capture',
                      label: 'Lead Capture',
                      icon: Target,
                      requiredPlan: 'pro',
                    },
                    {
                      href: '/export-data',
                      label: 'Export Data',
                      icon: Download,
                      requiredPlan: 'pro',
                    },
                  ]}
                />

                <NavMenuCollapsible
                  icon={Shield}
                  label="Enterprise"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                  items={[
                    {
                      href: '/workflow-builder',
                      label: 'Workflow Builder',
                      icon: Workflow,
                      requiredPlan: 'enterprise',
                    },
                    {
                      href: '/ai-console',
                      label: 'AI Console',
                      icon: Terminal,
                      requiredPlan: 'enterprise',
                    },
                    {
                      href: '/security',
                      label: 'Security',
                      icon: Shield,
                      requiredPlan: 'enterprise',
                      isDisabled: true,
                    },
                    {
                      href: '/white-label',
                      label: 'White-label',
                      icon: Paintbrush,
                      requiredPlan: 'enterprise',
                      isDisabled: true,
                    },
                    {
                      href: '/webhooks',
                      label: 'Webhooks',
                      icon: Webhook,
                      requiredPlan: 'enterprise',
                      isDisabled: true,
                    },
                  ]}
                />
                 <Separator className="my-2" />
                  <NavMenuItem href="/home" icon={Home} label="Home" plan={userPlan} onLockClick={() => setIsUpgradeModalOpen(true)} />
                  <NavMenuItem href="/billing" icon={CreditCard} label="Billing" plan={userPlan} onLockClick={() => setIsUpgradeModalOpen(true)} />
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <NavMenuItem
                  href="/settings"
                  icon={Settings}
                  label="Settings"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
                <NavMenuItem
                  href="/support"
                  icon={HelpCircle}
                  label="Support"
                  plan={userPlan}
                  onLockClick={() => setIsUpgradeModalOpen(true)}
                />
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 overflow-y-auto w-full">{children}</main>
        </div>
        <AnimatedFooter />
      </div>
    </SidebarProvider>
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      setProfileLoading(true);
      const unsubscribe = listenToUser(
        user.uid,
        (profile) => {
          setUserProfile(profile);
          setProfileLoading(false);
        },
        (err) => {
          console.error('Layout: Failed to listen to user profile.', err);
          setUserProfile(null);
          setProfileLoading(false);
        }
      );
      return () => unsubscribe();
    } else if (!loading) {
      setUserProfile(null);
      setProfileLoading(false);
    }
  }, [user?.uid, loading]);

  if (loading || profileLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect logic is better handled by a dedicated hook or middleware,
    // but returning null here prevents rendering of the layout for non-authed users.
    if (typeof window !== 'undefined') {
        router.push('/login');
    }
    return null;
  }
  
  const simpleLayoutPages = ['/home', '/billing', '/settings', '/support', '/prompts', '/brand-voice', '/prompt-library', '/daily-summary', '/collaboration', '/lead-capture', '/export-data', '/workflow-builder', '/ai-console'];
  const useSimpleLayout = simpleLayoutPages.some(p => pathname.startsWith(p));

  if (useSimpleLayout) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <SimpleHeader user={user} userProfile={userProfile} />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <AnimatedFooter />
      </div>
    );
  }

  return (
    <FullLayout user={user} subscription={userProfile?.subscription ?? null}>
      {children}
    </FullLayout>
  );
}
