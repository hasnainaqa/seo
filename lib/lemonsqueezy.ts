import {
  NewCheckout,
  createCheckout,
  getCustomer,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

/**
 * Parameters for creating a LemonSqueezy checkout
 */
interface CheckoutParams {
  variantId: string;
  redirectUrl: string;
  // discountCode: These will be used if you want to prefill the discount code.
  discountCode?: string;
  email: string;
  userId?: string;
}

/**
 * Parameters for creating a customer portal
 */
interface CustomerPortalParams {
  customerId: string;
}

/**
 * This is used to create a LemonSqueezy Checkout for one-time payments or subscriptions.
 * It's usually triggered with the <PurchaseButton /> component.
 * Webhooks are used to update the user's state in the database.
 */
export const createLemonSqueezyCheckout = async ({
  email,
  redirectUrl,
  variantId,
  discountCode,
  userId,
}: CheckoutParams): Promise<string | undefined> => {
  try {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY as string });

    const storeId = process.env.LEMONSQUEEZY_STORE_ID as string;

    const newCheckout: NewCheckout = {
      productOptions: {
        redirectUrl,
      },
      checkoutData: {
        discountCode,
        email,
        custom: {
          user_id: userId,
        },
      },
    };

    const { data, error } = await createCheckout(
      storeId,
      variantId,
      newCheckout
    );

    if (error) {
      throw error;
    }

    return data.data.attributes.url;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

/**
 * This is used to create Customer Portal sessions, so users can manage their subscriptions
 * (payment methods, cancel, etc.)
 */
export const createCustomerPortal = async ({
  customerId,
}: CustomerPortalParams): Promise<string | null> => {
  try {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY as string });

    const { data, error } = await getCustomer(customerId);

    if (error) {
      throw error;
    }

    return data.data.attributes.urls.customer_portal;
  } catch (error) {
    console.error(error);
    return null;
  }
};
