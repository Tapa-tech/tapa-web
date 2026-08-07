import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Auto-seed default Super Admin if no admin exists
async function seedAdmin() {
  try {
    const adminExists = await db.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!adminExists) {
      const email = "admin@tapa.co";
      const rawPassword = "AdminSecurePassword123!";
      const passwordHash = createHash("sha256")
        .update(rawPassword)
        .digest("hex");

      await db.user.create({
        data: {
          email,
          name: "Super Admin",
          role: "ADMIN",
          passwordHash,
          emailVerified: new Date(),
        },
      });

      console.log(`\n==================================================`);
      console.log(`[DATABASE SEED] Super Admin account auto-seeded!`);
      console.log(`Email: ${email}`);
      console.log(`Password: ${rawPassword}`);
      console.log(`==================================================\n`);
    }
  } catch {
    // Gracefully handle db connection blockers during compilation or stub local runs
  }
}

seedAdmin();
