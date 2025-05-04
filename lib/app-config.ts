export const appConfig = {
  // App name used for branding and SEO
  appName: "SEO Analytics",
  // Short description for SEO tags (can be overwritten)
  appTagline: "Your SEO Dashboard",
  // Detailed app description for SEO purposes
  appDescription:
    "Power Your SEO Strategy with Comprehensive Insights.",
  // Domain name without protocol or trailing slash
  domainName: "seoanalytics.vercel.app",
  // Full URL based on environment
  domainUrl:
    process.env.NODE_ENV === "production"
      ? "https://seoanalytics.vercel.app"
      : "http://localhost:3000",

  // Color configuration
  colors: {
    primary: "#df8709",
  },
  // Authentication route configuration
  auth: {
    signUp: "/register",
    login: "/login",
    afterLogin: "/dashboard",
    afterLogout: "/",
    // Redirect route for new users after first-time signup
    newUser: "/dashboard/account-settings/billing",
  },
  // Email configuration using Resend
  resend: {
    // Subdomain for sending emails (remove if not applicable)
    subdomain: "resend",
    // 'From' field for magic login links
    fromNoReply: `SEO Analytics <noreply@resend.starterkitpro.com>`,
    // 'From' field for other emails (e.g., abandoned carts, updates)
    fromAdmin: `Hasnain at SEO Analytics <hasnain@resend.seoanalytics.com>`,
    // Support email shown to customers (leave empty if not needed)
    supportEmail: "support@starterkitpro.com",
  },
  openai: {
    model: "gpt-4o-mini", // Or your preferred model, e.g., gpt-4.5
  },
  // Stripe payment configuration
  lemonsqueezy: {
    // Trail period in days (30 days) change 30 to according to your days
    // Set to 0 for no trail period or remove it and also remove from `lib/session`
    trailPeriod: 30 * 24 * 60 * 60 * 1000,
    billingRoute: "/dashboard/account-settings/billing",
    plans: [
      {
        variantId: "765545",
        price: 99,
        anchorPrice: 149,
        title: "Starter",
        // Payment mode is used for one time payment or lifetime
        mode: "payment", // "payment" or "subscription"
      },
      {
        variantId: "765546",
        price: 139,
        anchorPrice: 149,
        title: "Pro",
        // subscription mode is used for recurring payments
        mode: "subscription",
      },
    ],
  },
};
