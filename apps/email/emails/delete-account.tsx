import { DeleteAccountTemplate } from '@repo/email/templates/delete-account';
import type { FC } from 'react';

// Example usage
const ExampleDeleteAccountEmail: FC = () => (
  <DeleteAccountTemplate
    name="John Doe"
    deleteLink="http://localhost:3000/auth/delete-account?token=exampleToken"
  />
);

export default ExampleDeleteAccountEmail;
