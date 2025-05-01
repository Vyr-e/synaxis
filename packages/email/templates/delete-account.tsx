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

type DeleteAccountTemplateProps = {
  readonly name: string;
  readonly deleteLink: string;
};

export const DeleteAccountTemplate: FC<DeleteAccountTemplateProps> = ({
  name,
  deleteLink,
}) => {
  // Dark theme colors
  const redColor = '#f87171'; // Using Tailwind red-400 for delete button
  const darkBg = '#121212';
  const contentBg = '#1e1e1e';
  const textColor = '#e0e0e0';
  const mutedTextColor = '#a0a0a0';
  const borderColor = '#333333';

  return (
    <Html>
      <Head />
      <Preview>Confirm Your Account Deletion - Synaxis</Preview>
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
                Confirm Account Deletion
              </Heading>

              <Text
                className={`mb-[32px] text-center text-[16px] leading-[24px] text-[${mutedTextColor}]`}
              >
                We're sad to see you go, {name}. We received a request to delete
                your Synaxis account. To confirm this action, please click the
                button below.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  className={`box-border inline-block rounded-[4px] bg-[${redColor}] px-[32px] py-[12px] text-center font-bold text-white no-underline`}
                  href={deleteLink}
                >
                  Confirm Account Deletion
                </Button>
              </Section>

              <Text
                className={`text-center text-[14px] leading-[24px] text-[${mutedTextColor}]`}
              >
                This action is irreversible. If you change your mind, simply
                ignore this email and your account will remain active.
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
                className={`mb-[24px] text-center text-[14px] leading-[24px] text-[${redColor}] break-all`}
              >
                <Button href={deleteLink} target="_blank" rel="noreferrer">
                  Delete Account
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
              <Text className="m-0 mt-[8px]">
                If you have any feedback, please contact us at
                support@synaxis.app
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
