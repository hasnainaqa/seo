import { BillingDetails } from "@/components/account-settings/billing-details";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";

export default async function BillingSettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect(appConfig.auth.login);
  }
  return <BillingDetails user={currentUser} />;
}
