import React from "react";
import { render } from "@react-email/components";
import { Resend } from "resend";
import { appConfig } from "./app-config";

// Initialize Resend with API key
const resend = new Resend(process.env.AUTH_RESEND_KEY);

if (!process.env.AUTH_RESEND_KEY) {
  console.group("⚠️ AUTH_RESEND_KEY missing from .env");
  console.error("It's required to send emails.");
  console.error("If you don't need it, remove the code from /lib/resend.ts");
  console.groupEnd();
}

/**
 * Sends an email using Resend
 *
 * @async
 * @param {string} to - The recipient's email address
 * @param {string} subject - The subject of the email
 * @param {string} html - The HTML content of the email
 * @param {string} from - Optional from email address (overrides default)
 * @param {string} replyTo - Optional reply-to email address
 * @returns {Promise<boolean>} A Promise that resolves to true if the email was sent successfully
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = appConfig.resend.fromNoReply,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo && { replyTo }),
    });

    if (error) {
      console.error("Error sending email:", error);
      return false;
    }
    console.log(`Email sent to ${to}`, data);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Renders a React email component to HTML
 *
 * @param Component The React component to render
 * @param props The props to pass to the component
 * @returns A Promise that resolves to the rendered HTML
 */
export async function renderEmail<Props extends object>(
  Component: React.FunctionComponent<Props> | React.ComponentClass<Props>,
  props: Props
): Promise<string> {
  return await render(React.createElement(Component, props));
}
