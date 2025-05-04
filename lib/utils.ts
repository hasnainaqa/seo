import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { appConfig } from "@/lib/app-config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

export const isTrialPeriod = (createdAt: Date) => {
  const now = new Date();
  const trialEndDate = new Date(
    createdAt.getTime() + appConfig.lemonsqueezy.trailPeriod
  );
  return now < trialEndDate;
};

/**
 * Formats a number with commas as thousands separators
 * @param value The number to format
 * @returns Formatted number string
 */
export function formatNumber(value: any): string {
  if (value === undefined || value === null) return "0";
  
  const num = typeof value === "number" ? value : Number(value);
  return num.toLocaleString();
}

/**
 * Formats a decimal as a percentage
 * @param value The decimal value to format (e.g., 0.123)
 * @returns Formatted percentage string (e.g., "12.3%")
 */
export function formatPercentage(value: any): string {
  if (value === undefined || value === null) return "0%";
  
  const num = typeof value === "number" ? value : Number(value);
  return `${(num * 100).toFixed(1)}%`;
}
