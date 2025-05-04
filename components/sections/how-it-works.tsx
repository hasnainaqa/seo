"use client";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState, ReactNode } from "react";
import { SectionHeader } from "@/components/ui/custom/section-headers";
import { cn } from "@/lib/utils";
import Safari from "@/components/ui/custom/safari";
import {
  Search,
  TrendingUp,
  BarChart3,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  quote: string;
  author: string;
  avatar: string;
}

interface StepData {
  id: number;
  title: string;
  content: string;
  image: string;
  icon: ReactNode;
  stat: string;
  testimonial: Testimonial;
}

const data: StepData[] = [
  {
    id: 1,
    title: "1. Connect Your Website",
    content:
      "Authenticate with Google Search Console and securely connect your website to start tracking SEO data instantly.",
    image: "/dummy-image-black.svg",
    icon: <Search className="w-6 h-6 text-primary" />,
    stat: "100% secure connection",
    testimonial: {
      quote:
        "Connecting my site was super easy — just one click with Google authentication!",
      author: "Adeel R.",
      avatar: "/dummy-avatar.png",
    },
  },
  {
    id: 2,
    title: "2. Analyze SEO Performance",
    content:
      "Access detailed keyword rankings, page traffic insights, and content growth trends in an easy-to-use dashboard.",
    image: "/dummy-image-black.svg",
    icon: <TrendingUp className="w-6 h-6 text-primary" />,
    stat: "Up to 35% faster SEO insights",
    testimonial: {
      quote: "The dashboard shows everything I need without any extra noise.",
      author: "Sana U.",
      avatar: "/dummy-avatar.png",
    },
  },
  {
    id: 3,
    title: "3. Track Keywords and Pages",
    content:
      "Identify which keywords are gaining traction and monitor which pages are growing or declining over time.",
    image: "/dummy-image-black.svg",
    icon: <BarChart3 className="w-6 h-6 text-primary" />,
    stat: "Real-time keyword tracking",
    testimonial: {
      quote:
        "Keyword and page insights help me plan content updates perfectly!",
      author: "Hamza A.",
      avatar: "/dummy-avatar.png",
    },
  },
  {
    id: 4,
    title: "4. Subscribe for Full Access",
    content:
      "Unlock advanced features like detailed historical reports, AI keyword suggestions, and more by subscribing securely with Lemon Squeezy.",
    image: "/dummy-image-black.svg",
    icon: <CreditCard className="w-6 h-6 text-primary" />,
    stat: "Flexible pricing plans",
    testimonial: {
      quote: "Payment and upgrade were seamless — no confusion at all!",
      author: "Hira S.",
      avatar: "/dummy-avatar.png",
    },
  },
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (index: number) => void;
}

// Step Indicator Component
const StepIndicator = ({
  currentStep,
  totalSteps,
  onStepClick,
}: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center space-x-2 md:space-x-4 my-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          className="group flex flex-col items-center"
        >
          <div className="relative z-10">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                currentStep === index
                  ? "border-primary bg-primary text-white"
                  : "border-neutral-300 text-neutral-500 group-hover:border-primary/50"
              )}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div className="absolute top-1/2 left-full w-4 md:w-8 h-0.5 bg-neutral-300">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: currentStep > index ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
          <span
            className={cn(
              "text-xs mt-2 hidden md:block transition-colors",
              currentStep === index
                ? "text-primary font-medium"
                : "text-neutral-500"
            )}
          >
            Step {index + 1}
          </span>
        </button>
      ))}
    </div>
  );
};

interface TestimonialProps {
  testimonial: Testimonial;
}

// Testimonial Component
const Testimonial = ({ testimonial }: TestimonialProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="flex items-start space-x-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 mt-6"
    >
      <div className="shrink-0">
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
          <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 italic mb-2">
          "{testimonial.quote}"
        </p>
        <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          — {testimonial.author}
        </p>
      </div>
    </motion.div>
  );
};

// Main Component
export default function HowItWorks() {
  const autoPlayDelay = 9000;
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.3,
  });

  // Auto-advance steps
  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      setCurrentIndex(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [isInView]);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
    }, autoPlayDelay);

    return () => clearInterval(interval);
  }, [isInView, currentIndex]);

  // Handle manual step selection
  const handleStepClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div ref={ref}>
      <SectionHeader>
        <SectionHeader.HeaderContent>
          <SectionHeader.Badge>HOW IT WORKS</SectionHeader.Badge>
          <SectionHeader.Heading>
            Set Up Your SEO Dashboard in Minutes
          </SectionHeader.Heading>
          <SectionHeader.Text>
            Our platform makes it simple to connect your Google Search Console,
            track keywords, monitor website performance, and optimize your SEO
            strategy — all in just a few clicks.
          </SectionHeader.Text>
        </SectionHeader.HeaderContent>
        <SectionHeader.Content className="mt-12">
          <StepIndicator
            currentStep={currentIndex}
            totalSteps={data.length}
            onStepClick={handleStepClick}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-12 relative">
            {/* Left Side - Step Content */}
            <div className="order-2 lg:order-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center mb-4">
                    <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                      {data[currentIndex].icon}
                    </div>
                    <h3 className="text-2xl font-bold">
                      {data[currentIndex].title}
                    </h3>
                  </div>

                  <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {data[currentIndex].content}
                  </p>

                  <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 flex items-center">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary"
                      >
                        <path
                          d="M16 8L8 16M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white">
                        Pro Tip
                      </h4>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        {data[currentIndex].stat}
                      </p>
                    </div>
                  </div>

                  <Testimonial testimonial={data[currentIndex].testimonial} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Side - Visual Demonstration */}
            <div className="order-1 lg:order-2 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`image-${currentIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-lg"
                >
                  <Safari
                    src={data[currentIndex].image}
                    className="w-full h-auto rounded-xl border shadow-xl"
                  />

                  {/* Progress bar underneath the Safari window */}
                  <div className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded mt-6 overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      key={currentIndex}
                      transition={{
                        duration: autoPlayDelay / 1000,
                        ease: "linear",
                      }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </SectionHeader.Content>
      </SectionHeader>
    </div>
  );
}
