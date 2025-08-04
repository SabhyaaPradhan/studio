
import LoginForm from '@/components/auth/login-form';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';

export const metadata = {
    title: 'Login – Savrii AI',
    description: 'Log in to your Savrii account to manage your AI assistant.',
};

export default function LoginPage() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <main className="flex-grow flex items-center justify-center">
                    <LoginForm />
                </main>
            </div>
        </HeaderThemeProvider>
    );
}
