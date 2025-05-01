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

type InviteTemplateProps = {
  readonly name: string;
  readonly inviter: string;
  readonly inviteLink: string;
};

export const InviteTemplate: FC<InviteTemplateProps> = ({
  name,
  inviter,
  inviteLink,
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
      <Preview>You've been invited to join {name} on Synaxis!</Preview>
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
                You're Invited!
              </Heading>

              <Text
                className={`mb-[32px] text-center text-[16px] leading-[24px] text-[${mutedTextColor}]`}
              >
                Hey {name}, {inviter} has invited you to join their community on
                Synaxis. Click the button below to accept the invitation:
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className={`box-border inline-block rounded-[4px] bg-[${blueColor}] px-[32px] py-[12px] text-center font-bold text-white no-underline`}
                  href={inviteLink}
                >
                  Join Now
                </Button>
              </Section>

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                If you were not expecting this invitation, you can ignore this
                email.
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
                <Button
                  href={inviteLink}
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

// Removed example usage export
