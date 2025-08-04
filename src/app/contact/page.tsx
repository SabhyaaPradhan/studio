
import ContactPage from '@/components/contact/contact-page';
import { HeaderThemeProvider } from '@/components/landing/header-theme-provider';
import Header from '@/components/landing/header';
import Footer from '@/components/landing/footer';

export const metadata = {
    title: 'Contact Us – Savrii AI',
    description: "Get in touch with the Savrii team. We're here to help you automate smarter and answer any questions you have.",
};

export default function Contact() {
    return (
        <HeaderThemeProvider>
            <div className="flex flex-col min-h-screen bg-background">
                <Header />
                <main className="flex-grow pt-20">
                    <ContactPage />
                </main>
                <Footer />
            </div>
        </HeaderThemeProvider>
    );
}
