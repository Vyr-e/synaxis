import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { FC } from 'react';

type ContactTemplateProps = {
  readonly name: string;
  readonly email: string;
  readonly message: string;
};

export const ContactTemplate: FC<ContactTemplateProps> = ({
  name,
  email,
  message,
}) => {
  // Dark theme colors
  const darkBg = '#121212';
  const contentBg = '#1e1e1e';
  const textColor = '#e0e0e0';
  const mutedTextColor = '#a0a0a0';
  const borderColor = '#333333';

  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>New contact message from {name}</Preview>
        <Body className={`font-sans bg-[${darkBg}]`}>
          <Container className="mx-auto my-[40px] max-w-[500px] p-[20px]">
            <Section
              className={`rounded-[8px] border-[1px] border-solid border-[${borderColor}] bg-[${contentBg}] p-[40px]`}
            >
              <Text
                className={`m-0 mb-4 font-semibold text-2xl text-[${textColor}]`}
              >
                New message via Contact Form
              </Text>
              <Text className={`m-0 text-[${mutedTextColor}]`}>
                From: {name} ({email})
              </Text>
              <Hr className={`my-4 border-[${borderColor}]`} />
              <Text className={`m-0 text-[${textColor}]`}>{message}</Text>
            </Section>

            <Section
              className={`mt-[32px] text-center text-[12px] text-[${mutedTextColor}]`}
            >
              <Text className="m-0">
                © {new Date().getFullYear()} Synaxis. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
