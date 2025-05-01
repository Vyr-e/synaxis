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

type VerificationTemplateProps = {
  readonly name: string;
  readonly verificationLink: string;
};

export const VerificationTemplate: FC<VerificationTemplateProps> = ({
  name,
  verificationLink,
}) => {
  // Brand colors (can be adjusted)
  const blueColor = '#0077ff'; // Example blue, adjust if needed
  const darkBg = '#121212';
  const contentBg = '#1e1e1e';
  const textColor = '#e0e0e0'; // Light gray for text
  const mutedTextColor = '#a0a0a0'; // Dimmer gray
  const borderColor = '#333333';

  return (
    <Html>
      <Head />
      <Preview>Verify your email address - Synaxis</Preview>
      <Tailwind>
        {/* Dark mode body */}
        <Body className={`font-sans bg-[${darkBg}]`}>
          <Container className="mx-auto my-[40px] max-w-[500px] p-[20px]">
            {/* Dark mode content section */}
            <Section
              className={`rounded-[8px] border-[1px] border-solid border-[${borderColor}] bg-[${contentBg}] p-[40px]`}
            >
              {/* Centered logo description */}
              <Section className="mb-[32px] text-center">
                <Text className="m-0 mb-[8px] text-center">
                  {/* Dark logo placeholder */}
                  <span
                    className={`inline-block h-[40px] w-[40px] rounded-full border-[2px] border-solid border-[${borderColor}] bg-[#2A2A2A] shadow-md`}
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
                Verify Your Email Address
              </Heading>

              <Text
                className={`mb-[32px] text-center text-[16px] leading-[24px] text-[${mutedTextColor}]`}
              >
                {/* Using name prop */}
                Hey {name}, thanks for choosing Synaxis! To complete your
                registration and access your account, please verify your email
                address.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className={`box-border inline-block rounded-[4px] bg-[${blueColor}] px-[32px] py-[12px] text-center font-bold text-white no-underline`}
                  href={verificationLink} // Using verificationLink prop
                >
                  Verify Email Address
                </Button>
              </Section>

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                This verification link will expire in 24 hours. If you did not
                create an account with Synaxis, you can safely ignore this
                email.
              </Text>

              <Hr
                className={`my-[32px] border border-solid border-[${borderColor}]`}
              />

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                If the button above doesn't work, copy and paste this link into
                your browser:
              </Text>

              <Text
                className={`mb-[24px] text-center text-[14px] leading-[24px] text-[${blueColor}] break-all`}
              >
                <Button
                  href={verificationLink}
                  target="_blank"
                  rel="noreferrer"
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
              {/* Add address or remove if not needed */}
              {/* <Text className="m-0">
								Prinsengracht 123, 1015 Amsterdam, Netherlands
							</Text> */}
              {/* Add unsubscribe or relevant links */}
              {/* <Text className="m-0 mt-[12px]">
								<a href="https://synaxis.com/unsubscribe" className="text-gray-500 underline">
									Unsubscribe
								</a>
							</Text> */}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

// Removed static example export
// export default VerifyEmailTemplate;
