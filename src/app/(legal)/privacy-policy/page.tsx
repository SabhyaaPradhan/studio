
import LegalSection from '../components/legal-section';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy – Savrii',
    description: 'This Privacy Policy explains how Savrii collects, uses, and safeguards your information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 md:px-6 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: September 1, 2025</p>
      </header>

      <LegalSection title="1. Introduction">
        <p>
          At Savrii, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="2. Information We Collect">
        <p>We may collect:</p>
        <ul className="list-disc list-inside space-y-2">
            <li><strong>Account Information:</strong> Name, email, and login details.</li>
            <li><strong>Usage Data:</strong> How you interact with Savrii (pages visited, features used).</li>
            <li><strong>Uploaded Data:</strong> Files or text you provide to train AI.</li>
            <li><strong>Cookies:</strong> For analytics and improving user experience.</li>
        </ul>
      </LegalSection>
      <Separator />

      <LegalSection title="3. How We Use Your Data">
        <p>We use your data to:</p>
        <ul className="list-disc list-inside space-y-2">
            <li>Provide and improve our services.</li>
            <li>Personalize your AI responses.</li>
            <li>Communicate updates, offers, and support.</li>
            <li>Ensure security and prevent misuse.</li>
        </ul>
      </LegalSection>
      <Separator />

      <LegalSection title="4. Sharing of Information">
        <p>We do not sell or rent your data. We may share it only:</p>
        <ul className="list-disc list-inside space-y-2">
            <li>With trusted service providers who support our operations.</li>
            <li>If required by law or legal process.</li>
            <li>With your consent.</li>
        </ul>
      </LegalSection>
      <Separator />

      <LegalSection title="5. Data Security">
        <p>
          We use encryption, firewalls, and secure databases to protect your data. However, no method is 100% secure, and we cannot guarantee absolute protection.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="6. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of marketing emails.</li>
            <li>Request a copy of your stored data.</li>
        </ul>
      </LegalSection>
      <Separator />

      <LegalSection title="7. Data Retention">
        <p>
          We retain your data only as long as necessary to provide services or comply with legal obligations.
        </p>
      </LegalSection>
      <Separator />
      
      <LegalSection title="8. International Users">
        <p>
          If you access Savrii from outside India, note that your data may be stored and processed in India.
        </p>
      </LegalSection>
      <Separator />
      
      <LegalSection title="9. Changes to This Policy">
        <p>
          We may update this Privacy Policy occasionally. If we make major changes, we will notify you.
        </p>
      </LegalSection>
      <Separator />

      <LegalSection title="10. Contact Us">
        <p>
          If you have questions about this Privacy Policy, contact us at: 📧 privacy@savrii.com
        </p>
      </LegalSection>
    </div>
  );
}
