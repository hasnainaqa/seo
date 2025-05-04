import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { constructMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

// PROMPT TO GENERATE YOUR PRIVACY POLICY

// You are a lawyer specializing in privacy law.
// I need a simple, clear Privacy Policy for my website. Here's my information:

// - Website name: [YOUR WEBSITE NAME]
// - Website URL: [YOUR WEBSITE URL]
// - Description: [BRIEF DESCRIPTION OF WHAT YOUR SITE/APP DOES]
// - Personal data collected: [LIST TYPES OF DATA YOU COLLECT]
// - Non-personal data collected: [COOKIES, ANALYTICS, ETC.]
// - How we use data: [PRIMARY PURPOSES - ORDERS, ACCOUNT MANAGEMENT, ETC.]
// - Data sharing: [WHETHER YOU SHARE DATA WITH THIRD PARTIES]
// - Data security: [BASIC SECURITY MEASURES]
// - User rights: [ACCESS, DELETION, ETC.]
// - Children's privacy: [YOUR POLICY ON USERS UNDER 13/16/18]
// - International data transfers: [IF APPLICABLE]
// - Policy updates: [HOW USERS WILL BE NOTIFIED]
// - Contact information: [EMAIL FOR PRIVACY QUESTIONS]

// Please write a straightforward Privacy Policy with simple language that covers all legal requirements. Include the current date.
// Do not explain your reasoning. Provide only the finished Privacy Policy.

export const metadata: Metadata = constructMetadata({
  title: "Privacy policy | SEO Analytics",
  canonicalUrlRelative: "/privacy-policy",
});

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>
        <pre
          className="leading-relaxed whitespace-pre-wrap"
          style={{ fontFamily: "sans-serif" }}
        >
          {`Last Updated: September 26, 2023

Privacy Policy

This Privacy Policy explains how SEO Analytics ("we," "us," or "our") collects, uses, and protects your personal and non-personal information when you use our website located at https://seoanalytics.com (the “Website”).

By accessing or using the Website, you consent to the practices described in this Privacy Policy.

1. Information We Collect

1.1 Personal Information
When you use our Website or purchase our products, we may collect:

Name – Used to personalize communication and manage your account.
Email Address – Used for sending updates, order details, and customer support.
Payment Information – Collected through secure third-party payment processors. We do not store payment information on our servers.

1.2 Non-Personal Information
We collect non-personal data via cookies and similar technologies, including:

Browser type
Device information
IP address
Usage patterns

This helps us analyze trends, improve our services, and enhance user experience.

2. How We Use Your Information
We use the collected data for the following purposes:

Processing and fulfilling your orders
Sending confirmation emails and updates
Providing customer support
Improving website performance and service quality
Communicating important product or policy changes

3. Data Sharing and Third Parties
We do not sell, rent, or trade your personal information.

We may share your information only with trusted service providers necessary to:

Process payments
Deliver product updates
Improve user experience

All third-party partners are required to protect your information and comply with relevant data protection laws.

4. Data Security
We implement appropriate technical and organizational measures to protect your data. Sensitive information is transmitted over secure connections and stored with strong access controls.

5. Your Rights
If you are a resident of the EU or a region with similar data laws, you may:

Request access to your personal data
Request correction or deletion of your data
Object to or restrict our processing of your data
Withdraw consent at any time

To exercise these rights, contact us at hasnain@seoanalytics.com .

6. Cookies
Cookies help us personalize your experience and collect anonymous usage data. You can control or disable cookies through your browser settings.

7. Children's Privacy
The Website is not directed at children under 13. We do not knowingly collect data from children. If you believe your child has provided personal data, contact us to have it removed.

8. Changes to This Policy
We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted here, and users may be notified via email for significant changes.

9. Contact
If you have questions or requests related to this Privacy Policy, reach out at:

Email: hasnain@seoanalytics.com

By using Starterkitpro, you agree to the terms outlined in this Privacy Policy.`}
        </pre>
      </div>
    </div>
  );
}
