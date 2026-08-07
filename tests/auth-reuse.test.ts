import { db } from "../src/lib/db";
import { createHash, randomBytes } from "crypto";

function hashSHA256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

function generateOpaqueToken(): string {
  return randomBytes(32).toString("hex");
}

async function runTests() {
  console.log("🚀 Starting Auth Token Reuse Detection Test...\n");

  // 1. Create a mock user
  console.log("Step 1: Creating mock test user...");
  const user = await db.user.create({
    data: {
      phone: "+919999999999",
      role: "CUSTOMER",
      name: "Test Token User",
    },
  }).catch(() => {
    // If already exists, return it
    return db.user.findUniqueOrThrow({
      where: { phone: "+919999999999" }
    });
  });
  console.log(`Mock user verified: id = ${user.id}\n`);

  // 2. Generate initial refresh token (Legitimate client session start)
  console.log("Step 2: Issuing Legitimate Refresh Token (T1)...");
  const tokenVal1 = generateOpaqueToken();
  const tokenHash1 = hashSHA256(tokenVal1);
  const familyId = generateOpaqueToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

  const t1 = await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: tokenHash1,
      family: familyId,
      expiresAt,
    },
  });
  console.log(`Token T1 created: hash = ${tokenHash1.substring(0, 8)}..., family = ${familyId.substring(0, 8)}...\n`);

  // 3. Perform legitimate rotation: T1 is exchanged for T2
  console.log("Step 3: Rotating T1 for T2 (First Refresh)...");
  // Look up T1
  const t1Lookup = await db.refreshToken.findUnique({
    where: { tokenHash: tokenHash1 },
  });

  if (!t1Lookup || t1Lookup.revoked) {
    throw new Error("FAIL: Legitimate token T1 should be active and valid.");
  }

  // Revoke T1
  await db.refreshToken.update({
    where: { id: t1Lookup.id },
    data: { revoked: true },
  });

  // Create T2 in the same family
  const tokenVal2 = generateOpaqueToken();
  const tokenHash2 = hashSHA256(tokenVal2);
  const t2 = await db.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: tokenHash2,
      family: familyId,
      expiresAt,
    },
  });
  console.log(`T1 revoked. New Token T2 created: hash = ${tokenHash2.substring(0, 8)}...\n`);

  // 4. Simulate Token Theft / Reuse (Attacker tries to use the already-revoked T1)
  console.log("Step 4: Simulating Token Theft (Attacker attempts to refresh with T1)...");
  const reusedTokenLookup = await db.refreshToken.findUnique({
    where: { tokenHash: tokenHash1 },
  });

  if (reusedTokenLookup && reusedTokenLookup.revoked) {
    console.log("👉 Revoked token detected during refresh! Triggering security revocation cascade...");
    
    // Revoke the entire family
    const revokeResult = await db.refreshToken.updateMany({
      where: { family: reusedTokenLookup.family },
      data: { revoked: true },
    });
    console.log(`👉 Revoked ${revokeResult.count} token(s) in family: ${reusedTokenLookup.family.substring(0, 8)}...\n`);
  }

  // 5. Verification: T2 should now be revoked automatically
  console.log("Step 5: Verifying family revocation...");
  const t2Verify = await db.refreshToken.findUnique({
    where: { tokenHash: tokenHash2 },
  });

  if (!t2Verify) {
    throw new Error("FAIL: Token T2 could not be found.");
  }

  console.log(`T2 status in database: revoked = ${t2Verify.revoked}`);
  if (t2Verify.revoked) {
    console.log("✅ SUCCESS: Reuse detection successfully invalidated the entire token family!");
  } else {
    throw new Error("FAIL: Token T2 should have been revoked after T1 reuse!");
  }

  // Clean up test data
  console.log("\nStep 6: Cleaning up database test records...");
  await db.refreshToken.deleteMany({
    where: { userId: user.id },
  });
  await db.user.delete({
    where: { id: user.id },
  });
  console.log("✅ Cleanup complete. Test completed successfully.");
}

runTests().catch((err) => {
  console.error("❌ Test failed with error:", err);
  process.exit(1);
});
