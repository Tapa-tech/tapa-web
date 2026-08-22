import { inngest } from "@/lib/inngest/client";
import { fetchPanchangData } from "@/lib/panchang/provider";
import { db } from "@/lib/db";

export const dailyPanchangSync = inngest.createFunction(
  { 
    id: "daily-panchang-sync", 
    retries: 3,
    triggers: [{ cron: "0 2 * * *" }],
  },
  async ({ step }) => {
    const CITIES = ["Delhi-NCR"];
    const DAYS_AHEAD = 45;

    for (const city of CITIES) {
      for (let i = 0; i < DAYS_AHEAD; i++) {
        // Calculate target date: today + i days
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + i);
        // Standardize target date to midnight of that day in UTC
        const dateOnly = new Date(Date.UTC(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()));

        await step.run(`sync-${city}-${dateOnly.toISOString().substring(0, 10)}`, async () => {
          const existing = await db.panchangEntry.findUnique({
            where: { date_city: { date: dateOnly, city } },
          });

          // Never touch a manually-corrected record
          if (existing?.dataSource === "MANUAL_OVERRIDE") return;

          try {
            const data = await fetchPanchangData(dateOnly, city);

            await db.panchangEntry.upsert({
              where: { date_city: { date: dateOnly, city } },
              create: {
                ...data,
                city,
                date: dateOnly,
                dataSource: "AUTO_SYNCED",
                syncedAt: new Date(),
              },
              update: {
                ...data,
                dataSource: "AUTO_SYNCED",
                syncedAt: new Date(),
              },
            });
          } catch (e) {
            console.error(`Failed to sync panchang for ${city} on ${dateOnly.toISOString().substring(0, 10)}:`, e);
            // Do not throw/propagate the error so that one failed date does not abort the entire 45-day loop
          }
        });
      }
    }
  }
);
