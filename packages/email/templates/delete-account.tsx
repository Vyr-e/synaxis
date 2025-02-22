import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { FC } from 'react';

type DeleteAccountTemplateProps = {
  readonly name: string;
  readonly deleteLink: string;
};

export const DeleteAccountTemplate: FC<DeleteAccountTemplateProps> = ({
  name,
  deleteLink,
}) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>We're sad to see you go, {name}</Preview>
      <Body className="flex min-h-screen items-center justify-center bg-[#121212] p-4 font-sans">
        <Container className="mx-4 w-full max-w-[600px] overflow-hidden rounded-lg bg-[#1E1E1E] text-gray-200">
          {/* Header with Logo */}
          <Section className="p-2 pt-4">
            <div className="flex w-fit items-center gap-2 rounded-full bg-[#2A2A2A] px-4 py-2">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <title>logo</title>
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="#000000"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </svg>
              <span className="font-bold text-sm text-white">Synaxis</span>
              <span className="h-2 w-2 animate-ping rounded-full bg-blue-500" />
            </div>
          </Section>

          {/* Main Content */}
          <Section className="space-y-1 p-2">
            <div className="flex h-fit flex-col rounded-lg bg-[#2A2A2A] px-4 py-2">
              <div className="flex flex-col gap-2">
                <h2 className="mb-0 w-full text-left font-normal text-2xl">
                  We're sad to see you go, {name}
                </h2>
                <Text className="mt-0 text-lg">
                  Your account deletion request has been received. Before we say
                  goodbye, please confirm this action by clicking the button
                  below:
                </Text>
              </div>

              <Section className="flex items-center justify-center">
                <a
                  href={deleteLink}
                  className="relative h-12 w-fit overflow-hidden rounded-lg bg-red-400 px-6 py-2 font-medium text-sm text-white transition-all hover:text-red-300"
                  style={{ textDecoration: 'none' }}
                >
                  Confirm Account Deletion
                </a>
              </Section>
              <Text className="mt-4 text-gray-400/80 text-xs">
                If you change your mind, simply ignore this email and your
                account will remain active. We hope to see you again soon!
              </Text>
            </div>
          </Section>

          {/* Footer */}
          <Section className="space-y-4 border-gray-700 border-t p-4 text-gray-400 text-sm">
            <Text>
              If you have any feedback about your experience with Synaxis, we'd
              love to hear from you.{' '}
              <span className="text-white">
                reach out to us at{' '}
                <a
                  href="mailto:support@synaxis.app"
                  className="font-semibold text-white text-xs"
                >
                  support@synaxis.app
                </a>
              </span>
            </Text>

            <Section className="flex flex-row gap-3 space-x-6">
              <a
                href={'https://synaxis-app.vercel.app/legal/terms-of-use'}
                className="text-white hover:underline"
              >
                Terms of Use
              </a>
              <span>|</span>
              <a
                href={'https://synaxis-app.vercel.app/legal/privacy-policy'}
                className="text-white hover:underline"
              >
                Privacy Policy
              </a>
              <span>|</span>
              <a
                href={'https://synaxis-app.vercel.app/support/contact'}
                className="text-white hover:underline"
              >
                Contact Us
              </a>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

// Example usage
const ExampleDeleteAccountEmail: FC = () => (
  <DeleteAccountTemplate
    name="Jane"
    deleteLink="http://localhost:3000/auth/delete-account?token=exampleToken"
  />
);

export default ExampleDeleteAccountEmail;
