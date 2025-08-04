
import SignupForm from '@/components/auth/signup-form';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';
import GridBackground from '@/components/landing/grid-background';

export const metadata = {
    title: 'Sign Up – Savrii AI',
    description: 'Create an account to start your free trial with Savrii AI.',
};

export default function SignupPage() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background relative">
                <GridBackground />
                <Header />
                <main className="flex-grow flex items-center justify-center py-20 z-10">
                    <SignupForm />
                </main>
                <Footer />
            </div>
        </HeaderThemeProvider>
    );
}
