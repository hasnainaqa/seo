"use server";
 
import { getCurrentUser } from "@/lib/session";
import {
  createLemonSqueezyCheckout,
  createCustomerPortal,
} from "@/lib/lemonsqueezy";
import { appConfig } from "@/lib/app-config";
 
/**
 * Creates a checkout session with LemonSqueezy and redirects the user to the checkout page
 */
export const createCheckoutSessionAction = async (variantId: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("Unauthorized");
    }
 
    // Get the redirect URL from the app config or use a default
    const redirectUrl = `${appConfig.domainUrl}/dashboard?success=true`;
 
    // Create a checkout session with LemonSqueezy
    const checkoutUrl = await createLemonSqueezyCheckout({
      variantId,
      email: currentUser.email,
      redirectUrl,
      userId: currentUser.id,
    });
 
    if (!checkoutUrl) {
      throw new Error("Failed to create checkout session");
    }
 
    // Return the checkout URL so the client can redirect
    return { status: "success", url: checkoutUrl };
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return { status: "error" };
  }
};
 
/**
 * Creates a customer portal session for the user to manage their subscription
 */
export const createCustomerPortalAction = async () => {
  try {
    const currentUser = await getCurrentUser();
 
    if (!currentUser) {
      throw new Error("Unauthorized");
    }
 
    if (!currentUser.customerId) {
      throw new Error("User has no customer ID");
    }
 
    // Create a customer portal session with the customer ID
    const portalUrl = await createCustomerPortal({
      customerId: currentUser.customerId,
    });
 
    console.log("Portal URL:", portalUrl);
 
    if (!portalUrl) {
      throw new Error("Failed to create customer portal");
    }
 
    // Return the portal URL so the client can redirect
    return { status: "success", url: portalUrl };
  } catch (error) {
    console.error("Error creating customer portal:", error);
    return { status: "error" };
  }
};