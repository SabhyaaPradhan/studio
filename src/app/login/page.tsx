
import LoginForm from '@/components/auth/login-form';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export const metadata = {
    title: 'Login – Savrii AI',
    description: 'Log in to your Savrii account to manage your AI assistant.',
};

export default function LoginPage() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-20">
                    <LoginForm />
                </main>
                <Footer />
            </div>
        </HeaderThemeProvider>
    );
}
