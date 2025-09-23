'use client';

import { LegalPageView } from '../../_components/legal-page-view';

export default function TermsPage() {
  return (
    <LegalPageView
      title="Terms of Service"
      lastUpdated="January 1, 2025"
      content={termsContent}
    />
  );
}

const termsContent = `
## 1. Acceptance of Terms

By accessing and using Synaxis, you accept and agree to be bound by the terms and provision of this agreement.

## 2. Description of Service

Synaxis is a platform that connects communities and provides collaboration tools for users and brands.

## 3. User Accounts

You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer.

## 4. User Conduct

You agree not to use the service to:
- Violate any local, state, national, or international law
- Transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable
- Impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity

## 5. Privacy Policy

Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service.

## 6. Intellectual Property

The service and its original content, features, and functionality are owned by Synaxis and are protected by copyright, trademark, and other laws.

## 7. Termination

We may terminate or suspend your account at any time, without prior notice or liability, for any reason whatsoever.

## 8. Limitation of Liability

In no event shall Synaxis be liable for any indirect, incidental, special, consequential, or punitive damages.

## 9. Governing Law

These terms shall be governed by the laws of the jurisdiction in which Synaxis operates.

## 10. Changes to Terms

We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.

## Contact Information

If you have any questions about these Terms of Service, please contact us at legal@synaxis.com.
`;