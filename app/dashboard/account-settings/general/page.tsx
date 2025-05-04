import { getCurrentUser } from "@/lib/session";
import { GeneralSettingForm } from "@/components/forms/general-setting-form";
import { redirect } from "next/navigation";
import { appConfig } from "@/lib/app-config";

export default async function GeneralSettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect(appConfig.auth.login);
  }

  return <GeneralSettingForm user={currentUser} />;
}
