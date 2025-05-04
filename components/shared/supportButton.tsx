"use client";

import { appConfig } from "@/lib/app-config";
import Icons from "./icons";
import { Button } from "@/components/ui/button";

const SupportButton = () => {
  const handleSupportClick = () => {
    if (appConfig.resend.supportEmail) {
      window.open(
        `mailto:${appConfig.resend.supportEmail}?subject=Error Report: ${appConfig.appName}&body=Hello, I encountered an error...`,
        "_blank"
      );
    } else {
      alert("Support configuration not found.");
    }
  };

  return (
    <Button onClick={handleSupportClick}>
      <Icons.chat className="size-5" fill="currentColor" />
      Support
    </Button>
  );
};

export default SupportButton;
