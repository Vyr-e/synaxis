import { VerificationTemplate } from '@repo/email/templates/verification';
import type { FC } from 'react';

// Example usage
const ExampleVerificationEmail: FC = () => (
  <VerificationTemplate
    name="Jane Smith"
    verificationLink="http://localhost:3000/auth/verify-email?token=exampleToken"
  />
);

export default ExampleVerificationEmail;
