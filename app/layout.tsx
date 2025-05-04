import "./globals.css";
import type { Metadata, Viewport } from "next";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { TailwindIndicator } from "@/components/shared/tailwind-indicator";
import { ThemeProvider } from "next-themes";
import { appConfig } from "@/lib/app-config";
import { font } from "@/lib/fonts";
import NextTopLoader from "nextjs-toploader";
import { getViewportMetadata, constructMetadata } from "@/lib/seo/metadata";
import { ConfirmationDialogProvider } from "@/providers/confirmation-dialog-provider";

export const metadata: Metadata = {
  title: "SEO Analytics",
  description: "Your gateway to educational opportunities in Europe",
  icons: {
    icon: "/logo.svg", 
  },
}
export const viewport: Viewport = getViewportMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <ConfirmationDialogProvider>
              <NextTopLoader
                color={appConfig.colors.primary}
                showSpinner={false}
              />
              <Toaster richColors closeButton />
              {children}
              <TailwindIndicator />
            </ConfirmationDialogProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
