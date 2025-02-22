import { ChangeEmailTemplate } from '@repo/email/templates/change-email';
import type { FC } from 'react';

// Example usage
const ExampleChangeEmailEmail: FC = () => (
  <ChangeEmailTemplate changeLink="http://localhost:3000/auth/change-email?token=exampleToken" />
);

export default ExampleChangeEmailEmail;
