"use client";
import React, { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SectionHeader } from "@/components/ui/custom/section-headers";
import Image from "next/image";

interface ProgressBarProps {
  currentIndex: number;
  maxIndex: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  maxIndex,
}) => (
  <div className="absolute top-0 left-0 w-full h-1 bg-muted/20 z-10">
    <div
      className="h-full bg-primary transition-all duration-500 ease-in-out"
      style={{ width: `${(currentIndex / maxIndex) * 100}%` }}
    ></div>
  </div>
);

interface NavigationButtonsProps {
  currentIndex: number;
  maxIndex: number;
  handlePrev: () => void;
  handleNext: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentIndex,
  maxIndex,
  handlePrev,
  handleNext,
}) => (
  <div className="mt-6 pl-2 flex justify-start gap-4">
    <button
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none h-12 w-12 rounded-full disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:shadow-primary/30 hover:scale-105 active:scale-95"
      disabled={currentIndex === 0}
      onClick={handlePrev}
      aria-label="Previous slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-left h-4 w-4"
      >
        <path d="m12 19-7-7 7-7"></path>
        <path d="M19 12H5"></path>
      </svg>
      <span className="sr-only">Previous slide</span>
    </button>

    <button
      className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none h-12 w-12 rounded-full disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:shadow-primary/30 hover:scale-105 active:scale-95"
      disabled={currentIndex >= maxIndex}
      onClick={handleNext}
      aria-label="Next slide"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-arrow-right h-4 w-4"
      >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>
      <span className="sr-only">Next slide</span>
    </button>
  </div>
);

interface CarouselItemType {
  category: string;
  title: string;
  description: string;
  imageSrc: string;
}

interface CarouselItemProps {
  item: CarouselItemType;
  onPlusClick: (
    e: React.MouseEvent<HTMLButtonElement>,
    item: CarouselItemType
  ) => void;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item, onPlusClick }) => (
  <div className="group relative flex flex-col overflow-hidden rounded-xl text-card-foreground transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 bg-card border border-border h-full">
    <div className="relative flex transition-opacity duration-500 opacity-100 min-h-[300px] items-end overflow-hidden">
      <Image
        alt={item.title}
        loading="lazy"
        width="900"
        height="600"
        decoding="async"
        className="h-full max-h-[300px] w-full origin-center object-cover transition-all duration-700 ease-out scale-105 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
        src={item.imageSrc}
      />
      <div className="absolute inset-0 h-1/3 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none"></div>
    </div>

    <button
      className="absolute bottom-6 right-6 z-10 block rounded-full bg-primary p-4 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-110 hover:shadow-primary/30"
      onClick={(e) => onPlusClick(e, item)}
      aria-label="Open details"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-plus h-4 w-4 transition-all duration-500 group-hover:rotate-90 text-primary-foreground"
      >
        <path d="M5 12h14"></path>
        <path d="M12 5v14"></path>
      </svg>
    </button>

    <div className="flex flex-col gap-2 p-6">
      <p className="text-balance text-sm text-primary/90 font-medium tracking-wider uppercase">
        {item.category}
      </p>
      <h3 className="text-lg font-semibold tracking-tight text-balance">
        {item.title}
      </h3>
    </div>
  </div>
);

interface DetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: CarouselItemType | null;
}

const DetailDialog: React.FC<DetailDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedItem,
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogTitle></DialogTitle>
    <DialogContent className="sm:max-w-[800px] bg-card border border-border p-0 overflow-hidden rounded-xl shadow-2xl">
      {selectedItem && (
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-1/2 h-80 md:h-auto overflow-hidden">
            <Image
              src={selectedItem.imageSrc}
              alt={selectedItem.title}
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 w-full md:w-1/2 flex flex-col justify-between">
            <div>
              <p className="text-sm text-primary font-medium tracking-wider uppercase mb-2">
                {selectedItem.category}
              </p>
              <h3 className="text-2xl font-bold mb-4">{selectedItem.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-8">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:shadow-primary/20 transition-all duration-300 hover:scale-105">
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

const Carousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [maxIndex, setMaxIndex] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<CarouselItemType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [itemWidth, setItemWidth] = useState<number>(100);
  const sliderRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const items: CarouselItemType[] = [
    {
      category: "SEO Insights",
      title: "Comprehensive Data Analysis",
      description:
        "Gain in-depth SEO analytics and performance tracking by integrating with Google Search Console. Monitor your website growth and optimize your strategy.",
      imageSrc: "/dummy-image-black.svg",
    },
    {
      category: "Keyword Management",
      title: "Track Your Keywords Effectively",
      description:
        "Monitor keyword rankings, classify keywords as branded or non-branded, and discover growing or declining pages to enhance your SEO approach.",
      imageSrc: "/dummy-image-black.svg",
    },
    {
      category: "User Authentication",
      title: "Secure Google Login",
      description:
        "Easily and securely access your personalized dashboard using Google Authentication via NextAuth, ensuring your data remains protected.",
      imageSrc: "/dummy-image-black.svg",
    },
    {
      category: "Subscription Services",
      title: "Manage Your Plan with Ease",
      description:
        "Subscribe effortlessly using Lemon Squeezy for premium features. Manage your subscription and unlock advanced SEO tracking capabilities.",
      imageSrc: "/dummy-image-black.svg",
    },
    {
      category: "Responsive Design",
      title: "Optimized for All Devices",
      description:
        "Experience a modern, fast, and mobile-friendly platform designed with Next.js, Tailwind CSS, and ShadCN/UI for seamless SEO management on any device.",
      imageSrc: "/dummy-image-black.svg",
    },
  ];

  useEffect(() => {
    const calculateVisibleSlides = () => {
      if (!sliderRef.current) return;
      let slides = 1;
      if (window.innerWidth >= 1280) {
        slides = 2.8;
      } else if (window.innerWidth >= 1024) {
        slides = 1.8;
      } else if (window.innerWidth >= 640) {
        slides = 1.2;
      } else {
        slides = 1.2;
      }
      const width = 100 / slides;
      setItemWidth(width);
      setMaxIndex(items.length - Math.floor(slides) + (slides % 1 > 0 ? 0 : 1));
    };
    calculateVisibleSlides();
    window.addEventListener("resize", calculateVisibleSlides);
    return () => {
      window.removeEventListener("resize", calculateVisibleSlides);
    };
  }, [items.length]);

  const handleNext = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handlePlusClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: CarouselItemType
  ) => {
    e.stopPropagation();
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const getTransformValue = (): string => {
    return `translate3d(-${currentIndex * itemWidth}%, 0px, 0px)`;
  };

  return (
    <div id="features">

    <SectionHeader>
      <SectionHeader.HeaderContent className="container ml-0 text-start pl-2">
        <SectionHeader.Badge>FEATURES</SectionHeader.Badge>
        <SectionHeader.Heading>Key Features</SectionHeader.Heading>
        <SectionHeader.Text>
          Unlock powerful SEO analytics, manage your keywords efficiently, and
          optimize your website performance — all from a single, easy-to-use
          platform. 🚀
        </SectionHeader.Text>
      </SectionHeader.HeaderContent>

      <SectionHeader.Content>
        <div className="mx-auto flex max-w-container flex-col items-start">
          <div
            className="relative w-full overflow-hidden"
            role="region"
            aria-roledescription="carousel"
            ref={sliderRef}
          >
            <ProgressBar currentIndex={currentIndex} maxIndex={maxIndex} />
            <div className="relative">
              <div
                ref={itemsRef}
                className="flex transition-all duration-700 ease-out"
                style={{ transform: getTransformValue() }}
              >
                {items.map((item, index) => (
                  <div
                    key={index}
                    role="group"
                    aria-roledescription="slide"
                    className="min-w-0 shrink-0 grow-0 px-2"
                    style={{
                      width: `${itemWidth}%`,
                    }}
                  >
                    <CarouselItem item={item} onPlusClick={handlePlusClick} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NavigationButtons
            currentIndex={currentIndex}
            maxIndex={maxIndex}
            handlePrev={handlePrev}
            handleNext={handleNext}
          />
        </div>
      </SectionHeader.Content>

      <DetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
      />
    </SectionHeader>
    </div>
  );
};

export default Carousel;
