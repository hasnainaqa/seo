import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/custom/section-headers";
import Link from "next/link";
import Image from "next/image";

const StartSvg = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-6 h-6 text-yellow-500"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default function Hero() {
  return (
    <SectionHeader>
      <SectionHeader.Content>
        <div className="flex flex-col justify-center items-center max-w-7xl mx-auto ">
          <a
            href="/"
            className="flex w-auto items-center rounded space-x-2 bg-primary/20 pl-1 pe-2 py-1 ring-1 ring-accent whitespace-pre"
          >
            <div className="w-fit bg-primary rounded px-2 py-0.5 text-center text-xs font-medium text-primary-foreground sm:text-sm">
              📣 Announcement
            </div>
            <p className="text-xs flex rounded items-center font-medium sm:text-sm">
              <span>Introducing SEO Analytics </span>
              <span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </p>
          </a>
          <h1 className="mt-10 font-extrabold tracking-tighter text-center text-4xl lg:text-6xl/none bg-clip-tex">
            Power Your SEO Strategy with{" "}
            <span className="inline-block">
              <span className="relative bg-gradient-to-r from-primary/30 to-primary text-white px-2">
                Comprehensive Insights
              </span>
            </span>
          </h1>
          <p className="mt-10 text-lg leading-relaxed text-center max-w-4xl">
            Unlock powerful SEO analytics and keyword tracking with our advanced
            web-based platform. Seamlessly integrate with Google Search Console,
            manage your keywords efficiently, monitor your website's growth, and
            optimize your SEO strategy — all in one place.
          </p>
          <div className="mt-10 inline-flex items-center gap-3 max-md:mx-auto">
            <Link href="#pricing" passHref>
              <Button className="font-semibold text-base">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center space-x-4 text-sm">
            <div className="flex -space-x-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-10 rounded-full border-2  bg-transparent overflow-hidden"
                >
                  <Image
                    src="/dummy-avatar.png"
                    alt="User avatar"
                    height={35}
                    width={35}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col">
              <div className="flex ">
                <StartSvg />
                <StartSvg />
                <StartSvg />
                <StartSvg />
                <StartSvg />
              </div>
              <div className="font-semibold text-base text-muted-foreground/80">
                <span className="text-muted-foreground font-bold">67</span>{" "}
                makers SEO faster
              </div>
            </div>
          </div>
          <div className="relative group mt-16 md:mt-20">
            <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>

            <Image
              width={1200}
              height={1200}
              className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-t-2 border-secondary  border-t-primary/30"
              src="/dummy-image-black.svg"
              alt="dashboard"
            />
          </div>
        </div>
      </SectionHeader.Content>
    </SectionHeader>
  );
}
