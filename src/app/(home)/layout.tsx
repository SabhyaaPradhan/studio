
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
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
  Mic,
  Library,
  Calendar,
  Users,
  MousePointerClick,
  Download,
  BarChartBig,
  Code,
  Workflow,
  UploadCloud,
  Shield,
  Palette,
  Zap,
  Lock,
  ChevronDown,
  LogOut,
  Sparkles,
  Menu,
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
import { useState } from 'react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

type UserPlan = 'starter' | 'pro' | 'enterprise';

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
  plan: UserPlan;
  requiredPlan?: 'pro' | 'enterprise';
  isSubItem?: boolean;
  isDisabled?: boolean;
}) => {
  const pathname = usePathname();
  const Icon = icon;
  const isLocked = requiredPlan ? !hasPermission(plan, requiredPlan) : false;
  const isActive = pathname === href;

  const itemContent = (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className={cn(isLocked || isDisabled ? 'cursor-not-allowed opacity-60' : '')}
      tooltip={label}
    >
      <Link href={isLocked || isDisabled ? '#' : href}>
        <Icon />
        <span>{label}</span>
        {isLocked && <Lock className="ml-auto h-3.5 w-3.5" />}
      </Link>
    </SidebarMenuButton>
  );

  return (
    <SidebarMenuItem>
      {isLocked ? <UpgradeTooltip>{itemContent}</UpgradeTooltip> : itemContent}
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
  plan: UserPlan;
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

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="group">
          <Icon />
          <span>{label}</span>
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
            <SidebarMenuSubItem key={item.href}>
              <NavMenuItem
                href={item.href}
                icon={() => <div className="w-1 h-1 rounded-full bg-muted-foreground/80" />}
                label={item.label}
                plan={plan}
                requiredPlan={item.requiredPlan}
                isDisabled={item.isDisabled}
                isSubItem
              />
            </SidebarMenuSubItem>
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
  useAuthRedirectToLogin();
  
  // MOCK: In a real app, this would come from your user's data
  const [userPlan] = useState<UserPlan>('pro');

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

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
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/50">
        <Sidebar>
          <SidebarHeader>
             <Link href="/home" className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold">Savrii</h1>
             </Link>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              <NavMenuItem href="/home" icon={Home} label="Home" plan={userPlan} />
              <NavMenuItem href="/dashboard" icon={BarChartBig} label="Dashboard" plan={userPlan} />
              <NavMenuItem href="/chat" icon={MessageSquare} label="Chat / AI Assistant" plan={userPlan} isDisabled={true} />
              <NavMenuItem href="/analytics" icon={BarChart2} label="Analytics" plan={userPlan} isDisabled={true} />
              <NavMenuItem href="/integrations" icon={GitMerge} label="Integrations" plan={userPlan} isDisabled={true} />
              
              <NavMenuCollapsible icon={FileText} label="Content Mgmt" plan={userPlan} items={[
                  { href: "/custom-prompts", label: "Custom Prompts", requiredPlan: "pro", isDisabled: true },
                  { href: "/brand-voice", label: "Brand Voice Training", requiredPlan: "pro", isDisabled: true },
                  { href: "/prompt-library", label: "Prompt Library", requiredPlan: "pro", isDisabled: true },
              ]} />
              
               <NavMenuCollapsible icon={Users} label="Productivity" plan={userPlan} items={[
                  { href: "/daily-summary", label: "Daily Summary", requiredPlan: "pro", isDisabled: true },
                  { href: "/collaboration", label: "Collaboration Tools", requiredPlan: "pro", isDisabled: true },
                  { href: "/lead-capture", label: "Lead Capture Options", requiredPlan: "pro", isDisabled: true },
                  { href: "/export", label: "Export Conversations", requiredPlan: "pro", isDisabled: true },
              ]} />

              <NavMenuCollapsible icon={Settings} label="Advanced" plan={userPlan} items={[
                  { href: "/real-time-analytics", label: "Real-Time Analytics", requiredPlan: "enterprise", isDisabled: true },
                  { href: "/api-access", label: "API Access", requiredPlan: "enterprise", isDisabled: true },
                  { href: "/workflow-builder", label: "Workflow Builder", requiredPlan: "enterprise", isDisabled: true },
                  { href: "/custom-model", label: "Custom AI Model", requiredPlan: "enterprise", isDisabled: true },
                  { href: "/security", label: "Security & Compliance", requiredPlan: "enterprise", isDisabled: true },
                  { href: "/white-label", label: "White-label Settings", requiredPlan: "enterprise", isDisabled: true },
                  { href: "/webhooks", label: "Webhooks & Zapier", requiredPlan: "enterprise", isDisabled: true },
              ]} />


              <SidebarMenuItem className="mt-auto" />
              <SidebarMenuSub>
                  <hr className="my-2 border-border" />
              </SidebarMenuSub>
              <NavMenuItem href="/billing" icon={CreditCard} label="Billing" plan={userPlan} />
              <NavMenuItem href="/settings" icon={Settings} label="Settings" plan={userPlan} />
              <NavMenuItem href="/support" icon={HelpCircle} label="Support" plan={userPlan} />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <TooltipProvider>
                <div className="flex items-center gap-3 p-3 rounded-lg">
                    <Avatar>
                        <AvatarImage src={user?.photoURL || ''} />
                        <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold truncate">{user?.displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
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
        <main className="flex-1 flex flex-col">
            <header className="p-4 flex items-center gap-2 md:hidden sticky top-0 bg-background z-10 border-b">
                <SidebarTrigger>
                    <Menu className="w-6 h-6" />
                </SidebarTrigger>
                <Link href="/home" className="flex items-center gap-2 font-semibold text-lg">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span>Savrii</span>
                </Link>
            </header>
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
