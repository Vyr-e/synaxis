import { ResetPasswordTemplate } from '@repo/email/templates/reset-password';
import type { FC } from 'react';

// Example usage
const ExampleResetPasswordEmail: FC = () => (
  <ResetPasswordTemplate resetLink="http://localhost:3000/auth/reset-password?token=exampleToken" />
);

export default ExampleResetPasswordEmail;
