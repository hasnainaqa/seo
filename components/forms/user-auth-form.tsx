"use client";
import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Icons from "@/components/shared/icons";
import { appConfig } from "@/lib/app-config";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

interface UserAuthFormProps {
  className?: string;
  type: "register" | "login";
}

const UserAuthForm: FC<UserAuthFormProps> = ({ className = "", type }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {
    setIsLoading(true);
    signIn("google", {
      redirect: false,
      callbackUrl: appConfig.auth.afterLogin,
    });
  };

  return (
    <div className={cn("grid gap-6", className)}>
      <Button
        variant="outline"
        className="w-full"
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="animate-spin me-3" />}
        <Icons.google className="mr-2 size-5" />
        {type === "register" ? "Sign Up with Google" : "Login with Google"}
      </Button>
    </div>
  );
};

export default UserAuthForm;
