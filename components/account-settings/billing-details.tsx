import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plans } from "@/components/sections/pricing";
import { SafeUser } from "@/types/user-types";
import { CustomerPortalButton } from "@/components/shared/customer-portal-button";
import { appConfig } from "@/lib/app-config";

export function BillingDetails({ user }: { user: SafeUser }) {
  // If user has access (subscribed or purchased), show subscription management UI
  const plan = appConfig.lemonsqueezy.plans.find(
    (p) => p.variantId === user.variantId && user.hasAccess
  );

  if (user.hasAccess) {
    return (
      <Card className="shadow-none max-w-3xl">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current Plan</span>
              <span className="font-medium">
                {(user.hasAccess && plan?.title) || "Unknown Plan"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Status</span>
              <span className="font-medium text-green-500">
                {user.hasAccess && plan ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <CustomerPortalButton />
        </CardFooter>
      </Card>
    );
  }

  // If user doesn't have access, show plans
  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1">Choose a Plan</h2>
        <p className="text-muted-foreground">
          Select a plan to access premium features
        </p>
      </div>
      <section className="flex flex-col sm:flex-row sm:flex-wrap justify-start gap-8">
        <Plans />
      </section>
    </>
  );
}
