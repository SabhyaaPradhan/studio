
import LegalSection from '../components/legal-section';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service – Savrii',
    description: 'By accessing or using our services, you agree to comply with these Terms of Service.',
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: September 1, 2025</p>
      </header>

      <LegalSection title="1. Introduction">
        <p>
          Welcome to Savrii. By accessing or using our services, you agree to comply with these Terms of Service. Please read them carefully. If you do not agree, you should not use our services.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="2. Eligibility">
        <p>
          You must be at least 18 years old (or the legal age in your country) to use Savrii. By using the service, you confirm that you meet this requirement.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="3. Account Responsibilities">
        <ul className="list-disc list-inside space-y-2">
          <li>You are responsible for keeping your login credentials secure.</li>
          <li>You agree not to share your account with others.</li>
          <li>You must provide accurate and up-to-date information when registering.</li>
        </ul>
      </LegalSection>
      <Separator />
      
      <LegalSection title="4. Payments and Subscriptions">
        <ul className="list-disc list-inside space-y-2">
          <li>Some features of Savrii may require a paid subscription.</li>
          <li>By subscribing, you authorize us to charge your payment method on a recurring basis.</li>
          <li>Prices may change, but we will notify you before adjustments.</li>
        </ul>
      </LegalSection>
      <Separator />

      <LegalSection title="5. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-2">
            <li>Use Savrii for illegal or harmful activities.</li>
            <li>Upload or share harmful code (viruses, malware).</li>
            <li>Attempt to reverse-engineer or disrupt our systems.</li>
        </ul>
      </LegalSection>
      <Separator />
      
      <LegalSection title="6. Intellectual Property">
        <p>
          All trademarks, logos, and software are the property of Savrii. You may not copy, modify, or distribute our materials without permission.
        </p>
      </LegalSection>
      <Separator />
      
      <LegalSection title="7. Termination">
        <p>
          We may suspend or terminate your account if you violate these Terms. You can also close your account at any time.
        </p>
      </LegalSection>
      <Separator />
      
      <LegalSection title="8. Limitation of Liability">
        <p>
          Savrii is not liable for indirect, incidental, or consequential damages. Our maximum liability to you is limited to the amount paid in the past 12 months.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="9. Governing Law">
        <p>
          These Terms are governed by the laws of India. Any disputes will be handled in the courts of Chennai, Tamil Nadu.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="10. Contact Us">
        <p>
          If you have questions about these Terms, contact us at: 📧 support@savrii.com
        </p>
      </LegalSection>
    </div>
  );
}
