import UserAuthForm from "@/components/forms/user-auth-form";
import { Suspense } from "react";
import Link from "next/link";
import { appConfig } from "@/lib/app-config";
import Logo from "@/components/ui/custom/logo";
import { constructMetadata } from "@/lib/seo/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = constructMetadata({
  title: "Register | SEO Analytics",
  canonicalUrlRelative: "/register",
});

export default function Register() {
  return (
    <div className="flex h-screen w-screen">
      <div className="relative hidden h-full w-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900"></div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “With our powerful SEO analytics tool, you can track, analyze, and
              <br />
              improve your website’s performance, making data-driven decisions
              faster and easier.”
            </p>
            <footer className="text-sm">SEO Analytics Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="w-full p-6 md:px-10 ">
        <div className="flex pb-10 md:pb-16  justify-center items-center h-full w-full mx-auto">
          <div className="flex flex-col max-w-[400px] space-y-6">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to create your account
              </p>
            </div>
            <Suspense>
              <UserAuthForm type="register" />
            </Suspense>
            <p className="px-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={appConfig.auth.login}
                className="hover:text-brand underline underline-offset-4"
              >
                Login
              </Link>
            </p>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/tos"
                className="hover:text-brand underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="hover:text-brand underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
