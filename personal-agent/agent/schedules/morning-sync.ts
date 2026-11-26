import { defineSchedule } from "eve/schedules";
import { syncAllGoogle } from "../../src/connectors/google-sync";
import { PILOT_USER_ID, proactiveAllowed } from "../../src/server/store";

function sydneyHour(now = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Sydney",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now).find((p) => p.type === "hour")?.value;
  return Number(hour ?? "0");
}

/**
 * Vercel cron is UTC-only. Fire hourly near Sydney morning and gate on local hour.
 * Target: ~08:00 Australia/Sydney.
 */
export default defineSchedule({
  cron: "5 20-23 * * *",
  async run() {
    if (sydneyHour() !== 8) return;
    if (!(await proactiveAllowed(PILOT_USER_ID))) return;
    await syncAllGoogle(PILOT_USER_ID);
  },
});
