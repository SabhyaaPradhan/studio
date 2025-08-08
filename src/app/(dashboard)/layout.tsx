
'use client';

import { useAuthRedirectToLogin } from '@/hooks/use-auth-redirect-to-login';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { useAuthContext } from '@/context/auth-context';
import { Home, FileText, Bot, BarChart2, Settings, CreditCard, Mail, LogOut, Loader } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  useAuthRedirectToLogin();

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
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" isActive={true} tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Templates">
                <FileText />
                <span>Templates</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Prompt Builder">
                <Bot />
                <span>Prompt Builder</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Analytics">
                <BarChart2 />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip="Billing">
                <CreditCard />
                <span>Billing</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/contact" tooltip="Contact">
                <Mail />
                <span>Contact</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
                <div className="flex items-center gap-2 p-2">
                    <Avatar>
                        <AvatarImage src={user?.photoURL || ''} />
                        <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                        <span className="font-semibold text-sm truncate">{user?.displayName || 'User'}</span>
                        <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                    </div>
                     <Button variant="ghost" size="icon" onClick={handleLogout} className="ml-auto">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
