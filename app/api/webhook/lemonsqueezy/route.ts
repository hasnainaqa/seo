import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { appConfig } from "@/lib/app-config";
import { prisma } from "@/lib/db";
import { User } from "@prisma/client";
// import { sendEmail, renderEmail } from "@/lib/resend";
// import { RetentionOfferEmail } from "@/components/mails/retention-offer-email";

export async function POST(request: NextRequest) {
  console.log("Webhook received from Lemonsqueezy");
  const rawBody = await request.text();
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  if (!secret) {
    console.error("LEMONSQUEEZY_WEBHOOK_SECRET is not defined");
    return NextResponse.json("Server configuration error", { status: 400 });
  }
  // 1. Verify webhook signature
  const hmac = crypto.createHmac("sha256", secret);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") || "",
    "utf8"
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    console.error("Invalid webhook signature");
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  // 2. Parse payload
  const payload = JSON.parse(rawBody);
  const eventName = payload.meta.event_name;
  const attributes = payload.data.attributes;
  const lsCustomerId = attributes.customer_id;

  console.log(`Processing Lemonsqueezy event: ${eventName}`);
  console.log("payload.meta?.custom_data:", payload.meta?.custom_data);
  console.log("attributes:", attributes);

  try {
    // 3. Handle different webhook events
    switch (eventName) {
      case "order_created":
        // Handles both initial subscription payments and one-time purchases.
        console.log("Handling 'order_created' event...");

        // Extract necessary info from the order event
        const userId = payload.meta?.custom_data?.user_id; // User ID passed during checkout recommended
        const customerEmail = attributes.user_email;
        const lsVariantId = attributes.first_order_item?.variant_id; // The specific plan/product purchased
        console.log("userId:", userId);

        let user: User | null = null;

        // Find the user associated with the order.
        // Priority: Use the userId from custom_data (more reliable)
        if (userId) {
          console.log(`Attempting to find user by userId: ${userId}`);
          user = await prisma.user.findUnique({ where: { id: userId } });
        }
        // Fallback: Use the customer's email if userId wasn't found or provided
        if (!user && customerEmail) {
          console.log(`Attempting to find user by email: ${customerEmail}`);
          user = await prisma.user.findUnique({
            where: { email: customerEmail },
          });
        }

        if (!user) {
          console.error(
            `Webhook Error: User not found for order. Email: ${customerEmail}, userId: ${userId}`
          );
          // Acknowledge receipt to Lemon Squeezy even if user not found
          return NextResponse.json(
            { message: "User not found, webhook acknowledged." },
            { status: 200 }
          );
        }
        console.log(`Found user: ${user.id}`);

        // Verify the purchased plan/variant exists in app config
        const plan = appConfig.lemonsqueezy.plans.find(
          (p) => p.variantId.toString() === lsVariantId.toString()
        );
        if (!plan) {
          console.error(
            `Plan configuration missing for variantId: ${lsVariantId}`
          );
          // Consider how to handle this (e.g., log, return 200, or throw)
          throw new Error(
            `Plan configuration missing for variantId: ${lsVariantId}`
          );
        }

        // Update the user record upon successful order: store customer/variant IDs, grant access.
        console.log(`Updating user ${user.id} for order. Granting access.`);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            customerId: lsCustomerId?.toString() || null, // Store LS customer ID
            variantId: lsVariantId?.toString() || null, // Store purchased variant ID
            hasAccess: true, // Grant access
          } as Partial<User>,
        });
        console.log(`User ${user.id} updated successfully for order_created.`);
        break;

      case "subscription_updated":
        // Placeholder: Handles plan changes (upgrades/downgrades), renewals.
        // Consider adding logic here to:
        // 1. Find the user (likely via `lsCustomerId`).
        // 2. Update `variantId` if `attributes.variant_id` has changed.
        // 3. Update `hasAccess` based on `attributes.status` (e.g., 'active', 'past_due').
        console.log(
          "Handling 'subscription_updated' event (currently no action)."
        );
        break;

      case "subscription_expired":
        // Handles the end of a subscription period (access should be revoked).
        console.log("Handling 'subscription_expired' event...");

        // Find user by the Lemon Squeezy Customer ID associated with the subscription
        const userForSubExpire = await prisma.user.findFirst({
          where: { customerId: lsCustomerId?.toString() },
        });

        if (userForSubExpire) {
          console.log(
            `Updating user ${userForSubExpire.id} for subscription expiration. Revoking access.`
          );
          // Revoke access for the user
          await prisma.user.update({
            where: { id: userForSubExpire.id }, // Find user by customerId
            data: {
              hasAccess: false, // Revoke access
            } as Partial<User>,
          });
          console.log(
            `User ${userForSubExpire.id} updated successfully for subscription_expired.`
          );
        } else {
          console.error(
            `Webhook Error: User not found for subscription_expired. LS Customer ID: ${lsCustomerId}`
          );
        }

        // Send retention email offer
        // try {
        //   console.log(
        //     `Attempting to send retention email to ${userForSubExpire?.email}...`
        //   );
        //   const emailHtml = await renderEmail(RetentionOfferEmail, {
        //     name: userForSubExpire?.name ?? undefined, // Pass name if available
        //     discountCode: "COMEBACK20", // Placeholder discount code
        //     discountOffer: "20% off your next 3 months", // Example offer text
        //     resubscribeUrl: `${appConfig.domainUrl}/#pricing`,
        //   });

        //   await sendEmail({
        //     to: userForSubExpire?.email!,
        //     subject: `Regarding your ${appConfig.appName} Subscription`,
        //     html: emailHtml,
        //   });
        //   console.log(
        //     `Retention email sent successfully to ${userForSubExpire?.email}.`
        //   );
        // } catch (emailError: any) {
        //   console.error(
        //     `Failed to send retention email: ${emailError.message}`
        //   );
        //   // Do not fail the webhook response due to email error
        // }

        break;

      // Add other events if needed

      default:
        // Log events that aren't explicitly handled
        console.log(`Ignoring event: ${eventName}`);
    }

    // 4. Respond with 200 OK to acknowledge receipt
    return NextResponse.json(
      { message: "Webhook received and processed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Respond with 500 on processing errors
    return NextResponse.json(
      { message: "Internal server error processing webhook" },
      { status: 500 }
    );
  }
}
