
'use client';

import LoginForm from '@/components/auth/login-form';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import GridBackground from '@/components/landing/grid-background';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';

export default function LoginPage() {
    useAuthRedirect();
    
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background relative">
                <GridBackground />
                <Header />
                <main className="flex-grow flex items-center justify-center pt-20 z-10">
                    <LoginForm />
                </main>
                <Footer />
            </div>
        </HeaderThemeProvider>
    );
}
