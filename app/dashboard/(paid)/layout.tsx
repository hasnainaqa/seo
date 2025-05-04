import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";
import { getCurrentUser } from "@/lib/session";
import { isTrialPeriod } from "@/lib/utils";

export default async function DashboardPaidLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  if (
    currentUser &&
    !currentUser?.hasAccess &&
    !isTrialPeriod(currentUser.createdAt)
  ) {
    redirect(appConfig.lemonsqueezy.billingRoute);
  }

  return <>{children}</>;
}
