import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { FC } from 'react';

type ResetPasswordTemplateProps = {
  readonly resetLink: string;
};

export const ResetPasswordTemplate: FC<ResetPasswordTemplateProps> = ({
  resetLink,
}) => {
  // Dark theme colors (copied from verification template)
  const blueColor = '#0077ff';
  const darkBg = '#121212';
  const contentBg = '#1e1e1e';
  const textColor = '#e0e0e0';
  const mutedTextColor = '#a0a0a0';
  const borderColor = '#333333';

  return (
    <Html>
      <Head />
      <Preview>Reset Your Synaxis Password</Preview>
      <Tailwind>
        <Body className={`font-sans bg-[${darkBg}]`}>
          <Container className="mx-auto my-[40px] max-w-[500px] p-[20px]">
            <Section
              className={`rounded-[8px] border-[1px] border-solid border-[${borderColor}] bg-[${contentBg}] p-[40px]`}
            >
              {/* Logo Section */}
              <Section className="mb-[32px] text-center">
                <Text className="m-0 mb-[8px] text-center">
                  <span
                    className={`inline-block h-[40px] w-[40px] rounded-full border-[2px] border-solid border-[${borderColor}] bg-black shadow-md`}
                  />
                </Text>
                <Text
                  className={`m-0 font-bold text-[20px] text-[${textColor}]`}
                >
                  <span>Synaxis</span>
                </Text>
              </Section>

              <Heading
                className={`m-0 mb-[24px] text-center font-bold text-[24px] text-[${textColor}]`}
              >
                Reset Your Password
              </Heading>

              <Text
                className={`mb-[32px] text-center text-[16px] leading-[24px] text-[${mutedTextColor}]`}
              >
                We received a request to reset your password for your Synaxis
                account. Click the button below to set a new password.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className={`box-border inline-block rounded-[4px] bg-[${blueColor}] px-[32px] py-[12px] text-center font-bold text-white no-underline`}
                  href={resetLink}
                >
                  Reset Password
                </Button>
              </Section>

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                This password reset link is valid for 15 minutes. If you did not
                request a password reset, please ignore this email.
              </Text>

              <Hr
                className={`my-[32px] border border-solid border-[${borderColor}]`}
              />

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                If the button doesn't work, copy and paste this link into your
                browser:
              </Text>

              <Text
                className={`mb-[24px] text-center text-[14px] leading-[24px] text-[${blueColor}] break-all`}
              >
                {/* Displaying the link textually as fallback */}
                <Button
                  href={resetLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`text-[${blueColor}]`}
                >
                  Here
                </Button>
              </Text>
            </Section>

            <Section
              className={`mt-[32px] text-center text-[12px] text-[${mutedTextColor}]`}
            >
              <Text className="m-0">
                © {new Date().getFullYear()} Synaxis. All rights reserved.
              </Text>
              {/* Optional Footer Links */}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Keep example usage for testing/preview if needed, but don't export it as default
// const ExampleResetPasswordEmail: FC = () => (
//   <ResetPasswordTemplate resetLink="http://localhost:3000/auth/reset-password?token=exampleToken" />
// );
// export default ExampleResetPasswordEmail;
