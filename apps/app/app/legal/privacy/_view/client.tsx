'use client';

import { LegalPageView } from '../../_components/legal-page-view';

export default function PrivacyPage() {
  return (
    <LegalPageView
      title="Privacy Policy"
      lastUpdated="January 1, 2025"
      content={privacyContent}
    />
  );
}

const privacyContent = `
## 1. Information We Collect

We collect information you provide directly to us, such as when you create an account, update your profile, or contact us.

### Personal Information
- Name and email address
- Profile information you choose to provide
- Communications between you and other users

### Automatically Collected Information
- Device and usage information
- Log data and analytics
- Cookies and similar technologies

## 2. How We Use Your Information

We use the information we collect to:
- Provide, maintain, and improve our services
- Process transactions and send related information
- Send technical notices, updates, security alerts
- Respond to your comments, questions, and requests
- Monitor and analyze trends, usage, and activities

## 3. Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties except:
- With your consent
- To comply with legal obligations
- To protect our rights and safety
- With service providers who assist us in operating our platform

## 4. Data Security

We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 5. Your Rights

You have the right to:
- Access and update your personal information
- Delete your account and associated data
- Opt out of certain communications
- Request a copy of your data

## 6. Cookies and Tracking

We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.

## 7. Data Retention

We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.

## 8. International Data Transfers

Your information may be transferred to and processed in countries other than your own, where data protection laws may differ.

## 9. Children's Privacy

Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.

## 10. Changes to Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page.

## Contact Information

If you have any questions about this Privacy Policy, please contact us at privacy@synaxis.com.
`;