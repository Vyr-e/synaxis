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

type ChangeEmailTemplateProps = {
  readonly changeLink: string;
};

export const ChangeEmailTemplate: FC<ChangeEmailTemplateProps> = ({
  changeLink,
}) => {
  // Dark theme colors
  const blueColor = '#0077ff';
  const darkBg = '#121212';
  const contentBg = '#1e1e1e';
  const textColor = '#e0e0e0';
  const mutedTextColor = '#a0a0a0';
  const borderColor = '#333333';

  return (
    <Html>
      <Head />
      <Preview>Verify Your New Email Address - Synaxis</Preview>
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
                Verify Your New Email Address
              </Heading>

              <Text
                className={`mb-[32px] text-center text-[16px] leading-[24px] text-[${mutedTextColor}]`}
              >
                We received a request to change the email address associated
                with your Synaxis account. Please click the button below to
                verify this new email address.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className={`box-border inline-block rounded-[4px] bg-[${blueColor}] px-[32px] py-[12px] text-center font-bold text-white no-underline`}
                  href={changeLink}
                >
                  Verify New Email
                </Button>
              </Section>

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                If you did not request this change, you can safely ignore this
                email. Your current email address will remain unchanged.
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
                <Button href={changeLink} target="_blank" rel="noreferrer">
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

// Removed example usage export
