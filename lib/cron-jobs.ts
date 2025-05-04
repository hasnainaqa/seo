import cron from "node-cron";
import { syncGSCData } from "@/cron/sync-gsc-data";

// Schedule the GSC data sync job to run daily at 1:00 AM
console.log("Init crons...");

cron.schedule("0 1 * * *", () => {
  // Run for all users (no specific userId)
  syncGSCData();
});
