import React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Link,
  Tailwind,
} from "@react-email/components";
import { appConfig } from "@/lib/app-config";

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout: React.FC<EmailLayoutProps> = ({
  previewText,
  children,
}) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="bg-white rounded-lg my-10 mx-auto p-5 max-w-[600px]">
            <Section className="py-5 text-center">
              <Text className="text-2xl font-bold text-blue-600 m-0">
                {appConfig.appName}
              </Text>
            </Section>

            {children}

            <Hr className="border-gray-200 my-5" />

            <Section className="text-gray-500 text-xs leading-4">
              <Text className="text-center">
                &copy; {new Date().getFullYear()} {appConfig.appName}. All rights
                reserved.
              </Text>
              <Text className="text-center">
                If you have any questions, please contact us at{" "}
                <Link
                  href={`mailto:${appConfig.resend.supportEmail}`}
                  className="text-blue-600 underline"
                >
                  {appConfig.resend.supportEmail}
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
