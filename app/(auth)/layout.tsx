import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  if (currentUser) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
