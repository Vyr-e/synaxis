import { InviteTemplate } from '@repo/email/templates';
import type { FC } from 'react';
const ExampleInviteEmail: FC = () => (
  <InviteTemplate
    name="Jane Smith"
    inviter="John Doe"
    inviteLink="http://localhost:3000/auth/invite?token=exampleToken"
  />
);

export default ExampleInviteEmail;
