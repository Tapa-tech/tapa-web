import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { dailyPanchangSync } from "@/lib/panchang/sync-job";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    dailyPanchangSync,
  ],
});
