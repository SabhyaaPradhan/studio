
import LoginForm from '@/components/auth/login-form';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import GridBackground from '@/components/landing/grid-background';

export const metadata = {
    title: 'Login – Savrii AI',
    description: 'Log in to your Savrii account to manage your AI assistant.',
};

export default function LoginPage() {
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
