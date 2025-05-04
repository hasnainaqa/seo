import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Terms of Service | SEO Analytics",
  canonicalUrlRelative: "/tos",
});

export default function TOS() {
  return (
    <div className="flex justify-center p-4 min-h-screen">
      <div className="w-full max-w-2xl py-12 px-6 sm:px-8 space-y-8">
        <Link
          href="javascript:history.back()"
          className={buttonVariants({ variant: "ghost" })}
        >
          <ArrowLeft className="mr-2" /> Back
        </Link>
        <h1 className="text-4xl sm:text-3xl font-extrabold bg-clip-text">
          Terms and Conditions
        </h1>
        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: April 19, 2025

Thank you for visiting SEO Analytics ("we," "us," or "our"). This Terms of Service outlines how we collect, use, and protect your personal and non-personal information when you use our website located at https://seoanalytics.com (the "Website").

By accessing or using the Website, you agree to these Terms of Service. If you do not agree, please do not use the Website.

Information We Collect

1.1 Personal Information
We collect the following types of personal data:

Name – Used to personalize your experience and for communication.

Email Address – Used for updates, order confirmations, and communication.

Payment Details – Collected to process your purchases securely. Note: We do not store payment data. All transactions are processed through secure third-party providers.

1.2 Non-Personal Information
We may collect non-personal data using cookies and similar technologies. This may include:

IP address

Browser type

Device data

Browsing behavior

This helps us improve site performance, analyze usage trends, and enhance user experience.

1.3 Google Search Console Data
We also collect data from Google Search Console, which may include:

Website performance metrics (such as clicks, impressions, CTR, and average position)

Search queries related to your website

Indexing status and coverage reports

Mobile usability reports and Core Web Vitals data

This data is collected to provide you with detailed SEO insights, monitor website health, and offer actionable recommendations.

How We Use Your Data
We use your information strictly for the following purposes:

Fulfilling and managing your orders

Sending order confirmations and updates

Providing customer support

Improving our services, SEO reporting, and communication

Data Sharing Policy
We do not sell, rent, or trade your personal information.

Your data may be shared only with trusted third parties for the purpose of order processing (e.g., payment processors) or to enable SEO analytics features (e.g., authorized Google API access).

Children's Privacy
The Website is not intended for children under 13 years of age.

We do not knowingly collect personal data from children. If you believe your child has submitted information to us, please contact us immediately.

Changes to This Policy
We may update these Terms of Service periodically. Changes will be posted on this page. For significant updates, we may notify you by email.

Contact Us
For questions, concerns, or requests related to this Terms of Service:

Email: hasnain@seoanalytics.com
For other inquiries, please visit the Contact Us page on our Website.

By using SEO Analytics, you acknowledge and agree to the terms outlined in this document.


`}
        </pre>
      </div>
    </div>
  );
}
