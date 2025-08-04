
import SignupForm from '@/components/auth/signup-form';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';

export const metadata = {
    title: 'Sign Up – Savrii AI',
    description: 'Create an account to start your free trial with Savrii AI.',
};

export default function SignupPage() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <main className="flex-grow flex items-center justify-center py-12">
                    <SignupForm />
                </main>
            </div>
        </HeaderThemeProvider>
    );
}
