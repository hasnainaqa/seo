"use client";
import { Check, X } from "lucide-react";
import { SectionHeader } from "@/components/ui/custom/section-headers";
import { PurchaseButton } from "@/components/shared/purchase-button";
import { Separator } from "@/components/ui/separator";
import { appConfig } from "@/lib/app-config";

interface PlanProps {
  title: string;
  popular: boolean;
  description: string;
  priceTagline?: string;
  features: { title: string; isIncluded?: boolean }[];
  variantId: string;
  price: number;
  anchorPrice: number;
  footerTagline?: string;
}

const plans: PlanProps[] = [
  {
    popular: false,
    description: "Perfect for small projects",
    priceTagline: "lifetime deal",
    ...appConfig.lemonsqueezy.plans[0],
    footerTagline: "Perfect life time deal",
    features: [
      { title: "NextJS boilerplate" },
      { title: "Blog & Doc" },
      { title: "Sendgrid / Resend email" },
      { title: "Lemon Sqeezy" },
      { title: "Social Login / Magic Link" },
      { title: "Open Ai" },
      { title: "S3 / Cloudinary" },
      { title: "ChatGPT prompts for terms & privacy" },
      { title: "Other Ui tailwind library links" },
      { title: "No Updates", isIncluded: false },
    ],
  },

  {
    popular: true,
    description: "Need more power",
    priceTagline: "per month",
    ...appConfig.lemonsqueezy.plans[1],
    footerTagline: "Subscribe to get more",
    features: [
      { title: "NextJS boilerplate" },
      { title: "Blog & Doc" },
      { title: "Sendgrid / Resend email" },
      { title: "Lemon Sqeezy" },
      { title: "Social Login / Magic Link" },
      { title: "Open Ai" },
      { title: "S3 / Cloudinary" },
      { title: "ChatGPT prompts for terms & privacy" },
      { title: "Other Ui tailwind library links" },
      { title: "Lifetime updates", isIncluded: true },
    ],
  },
];

export default function Pricing() {
  return (
    <div id="pricing">
      <SectionHeader>
        <SectionHeader.HeaderContent>
          <SectionHeader.Badge>PRICING</SectionHeader.Badge>
          <SectionHeader.Heading>Pricing</SectionHeader.Heading>
          <SectionHeader.Text>
            Don&apos;t just take our word for it. Here&apos;s what others have
            to say.
          </SectionHeader.Text>
        </SectionHeader.HeaderContent>

        <SectionHeader.Content>
          <section className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-8">
            <Plans />
          </section>
        </SectionHeader.Content>
      </SectionHeader>
    </div>
  );
}

export function Plans() {
  return plans.map((plan: PlanProps, index) => (
    <PlanCard key={index} plan={plan} />
  ));
}

function PlanCard({ plan }: { plan: PlanProps }) {
  const anchorPrice = plan.anchorPrice;

  return (
    <div
      className={`bg-card rounded-xl text-card-foreground shadow w-full sm:w-96 justify-between py-1 mx-auto sm:mx-0 flex flex-col ${
        plan.popular ? "border-2 border-primary/50" : ""
      }`}
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="flex justify-between">
          <h3 className="text-lg lg:text-xl font-bold ">{plan.title}</h3>
          {plan.popular && (
            <div className="font-medium whitespace-nowrap rounded-lg px-2.5 h-fit text-sm py-1 bg-primary text-primary-foreground">
              Popular
            </div>
          )}
        </div>
        <div>
          <p>{plan.description}</p>
        </div>
        <Separator className="my-4" />

        <div>
          <div className="flex gap-0.5">
            <div className="flex gap-2">
              <div className="flex flex-col justify-end mb-[4px] text-lg ">
                <p className="opacity-80">
                  <span className="absolute bg-base-content h-[1.5px] inset-x-0 top-[48%]"></span>
                  <span className="text-2xl font-semibold line-through">
                    {anchorPrice}
                  </span>
                </p>
              </div>
              <p className="text-6xl tracking-tight font-extrabold">
                {plan.price}
              </p>
              <div className="flex flex-col justify-end mb-[4px]">
                <p className="text-xs opacity-60 uppercase font-semibold">
                  USD
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {plan.priceTagline}
          </p>
        </div>
        <Separator className="my-4" />
        <div className="pt-2 flex flex-col gap-2">
          {plan.features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
      <div className="flex flex-col mt-auto items-center pt-0 p-6 w-full">
        <PurchaseButton variantId={plan.variantId} />
        <p className="flex mt-2 text-muted-foreground items-center justify-center gap-2 text-sm text-center font-medium">
          {plan.footerTagline}
        </p>
      </div>
    </div>
  );
}

function Feature({
  title,
  isIncluded,
}: {
  title: string;
  isIncluded?: boolean;
}) {
  return (
    <>
      {isIncluded === undefined ? (
        <div className="flex gap-2 items-center space-y-1 leading-relaxed text-base">
          <Check className="mt-1" size={18} />
          <p className="font-medium">{title}</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center space-y-1 leading-relaxed text-base">
          {isIncluded ? (
            <Check className="mt-1 text-green-500" size={18} />
          ) : (
            <X className="mt-1 text-red-500" size={18} />
          )}
          <p
            className={`font-medium ${isIncluded ? "text-green-500" : "text-red-500"}`}
          >
            {title}
          </p>
        </div>
      )}
    </>
  );
}
