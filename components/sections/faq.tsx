"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { SectionHeader } from "@/components/ui/custom/section-headers";

interface FAQProps {
  question: string;
  answer: string;
}

const FAQList: FAQProps[] = [
  {
    question: "What is the purpose of this SEO analytics platform?",
    answer:
      "Our platform provides deep SEO insights, keyword tracking, Page Traffic Monitoring and Location Traffic Insights by integrating with Google Search Console, helping you optimize your website rankings.",
  },
  {
    question: "How do I connect my Google Search Console account?",
    answer:
      "After signing up and logging in with Google Auth, you can securely connect your Google Search Console to pull your website data automatically.",
  },
  {
    question: "Is there a free version available?",
    answer:
      "No! Full access to advanced analytics and keyword tracking requires a subscription through Lemon Squeezy.",
  },
  {
    question: "How secure is my data?",
    answer:
      "Your data is protected with OAuth authentication and securely stored in MongoDB. We never share your personal SEO data with third parties.",
  },
  {
    question: "Can I monitor multiple websites with one account?",
    answer:
      "Yes! Our platform allows you to manage and monitor multiple websites under a single account, making it ideal for agencies and SEO professionals.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <SectionHeader className="container mx-auto md:w-[700px]">
      <SectionHeader.HeaderContent>
        <SectionHeader.Badge>FAQ</SectionHeader.Badge>
        <SectionHeader.Heading>
          Frequently Asked Questions
        </SectionHeader.Heading>
        <SectionHeader.Text>
          Answers to common questions about our SEO Analytics and Keyword Management platform.
        </SectionHeader.Text>
      </SectionHeader.HeaderContent>
      <SectionHeader.Content>
        <div className="mx-auto mb-12 md:max-w-[800px]">
          {FAQList.map((faq, index) => (
            <div
              key={index}
              className="w-full border rounded-lg overflow-hidden mt-2"
            >
              <h3 className="flex">
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="flex flex-1 items-center justify-between py-4 px-4 font-medium transition-all hover:underline"
                  aria-expanded={openIndex === index}
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </h3>
              {openIndex === index && (
                <div className="px-4 pb-4 text-sm text-foreground transition-all">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <h4 className="text-center text-sm font-medium tracking-tight text-foreground/80">
          Still have questions? Email us at{" "}
          <a
            href="mailto:support@seoplatform.com"
            className="underline text-primary"
          >
            support@seoplatform.com
          </a>
        </h4>
      </SectionHeader.Content>
    </SectionHeader>
  );
}
