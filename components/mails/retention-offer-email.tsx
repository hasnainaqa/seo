import React from "react";
import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/components/mails/email-layout";
import { appConfig } from "@/lib/app-config";

interface RetentionOfferEmailProps {
  name?: string;
  discountCode: string;
  discountOffer: string; // e.g., "20% off for 3 months"
  resubscribeUrl?: string; // Direct link to upgrade/resubscribe page
}

export const RetentionOfferEmail: React.FC<RetentionOfferEmailProps> = ({
  name = "there",
  discountCode,
  discountOffer,
  resubscribeUrl = `${appConfig.domainUrl}/#pricing`, // Default to pricing section
}) => {
  const previewText = `Regarding your ${appConfig.appName} subscription`;

  return (
    <EmailLayout previewText={previewText}>
      <Section className="px-6">
        <Heading className="text-2xl font-bold text-gray-800 my-6">
          Following Up on Your {appConfig.appName} Subscription
        </Heading>

        <Text className="text-base text-gray-600 my-4">
          Hi {name},
        </Text>

        <Text className="text-base text-gray-600 my-4">
          We saw that you recently canceled your premium subscription for {appConfig.appName}. We hope everything was okay during your time with us.
        </Text>

        <Text className="text-base text-gray-600 my-4">
          We're always looking to improve. If you have a moment, we'd greatly appreciate any feedback on why you decided to cancel. Simply reply to this email – we read every response.
        </Text>

        <Text className="text-base text-gray-600 my-4">
          If you reconsider, we'd love to have you back. As a thank you for being a past customer, feel free to use the code <strong className="font-semibold">{discountCode}</strong> for {discountOffer} on any plan.
        </Text>

        <Section className="text-center my-8">
          <Button
            href={resubscribeUrl} // Link to pricing or upgrade page
            className="bg-blue-600 hover:bg-blue-700 rounded-md px-6 py-3 text-white font-medium no-underline text-center"
          >
            View Plans
          </Button>
        </Section>

        <Text className="text-base text-gray-600 my-4">
          Thanks,
          <br />
          The {appConfig.appName} Team
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-4">
        <Text className="text-xs text-gray-500">
          You received this email because you recently canceled your
          subscription.
        </Text>
      </Section>
    </EmailLayout>
  );
};
