import { SignJWT } from "jose";
import path from "path";
import fs from "fs";

// Load environment variables manually
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        let val = trimmed.substring(idx + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  });
}

const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-at-least-32-chars-long"
);

// Sign access token helper
async function signToken(payload) {
  return new SignJWT({
    userId: payload.userId,
    role: payload.role,
    phone: payload.phone,
    email: payload.email,
    consentGiven: payload.consentGiven || false,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(AUTH_SECRET);
}

async function runAudit() {
  console.log("=== THE TAPA CO. ADMIN PANEL / CMS AUDIT ===\n");

  // 1. Generate Tokens
  const adminToken = await signToken({
    userId: "cmsmsnw3f0000r24zpiucgj5l", // Seeded Super Admin ID
    role: "SUPER_ADMIN",
    email: "admin@tapa.co",
    consentGiven: true
  });

  const customerToken = await signToken({
    userId: "cmsy851p2001w4bm2hr1ygkqg", // Seeded Customer ID
    role: "CUSTOMER",
    email: "customer@tapa.co",
    consentGiven: true
  });

  const baseUrl = "http://localhost:3000";

  console.log("1. SECURITY: Testing RBAC Protection...");
  
  // Test non-admin access (Forbidden)
  const resForbidden = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: {
      "Cookie": `access_token=${customerToken}`
    }
  });
  console.log(`- Request with CUSTOMER token -> Status: ${resForbidden.status} (Expected: 403)`);

  // Test no-token access (Unauthorized)
  const resUnauthorized = await fetch(`${baseUrl}/api/admin/dashboard`);
  console.log(`- Request without token -> Status: ${resUnauthorized.status} (Expected: 401)`);

  // Test admin access (Success)
  const resSuccess = await fetch(`${baseUrl}/api/admin/dashboard`, {
    headers: {
      "Cookie": `access_token=${adminToken}`
    }
  });
  console.log(`- Request with SUPER_ADMIN token -> Status: ${resSuccess.status} (Expected: 200)`);
  if (resSuccess.ok) {
    const data = await resSuccess.json();
    console.log(`  Metrics: ${JSON.stringify(data)}`);
  }

  console.log("\n2. SOURCES LIBRARY: Testing CRUD Operations...");
  
  // Create Source
  const createSourceRes = await fetch(`${baseUrl}/api/admin/sources`, {
    method: "POST",
    headers: {
      "Cookie": `access_token=${adminToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "Audit Purana",
      reference: "Audit Skanda / Khanda 1",
      type: "PURANIC"
    })
  });
  console.log(`- Create Source -> Status: ${createSourceRes.status} (Expected: 201)`);
  let sourceId = "";
  if (createSourceRes.ok) {
    const newSource = await createSourceRes.json();
    sourceId = newSource.id;
    console.log(`  Created Source ID: ${sourceId}`);
  }

  // Get Sources List
  const listSourcesRes = await fetch(`${baseUrl}/api/admin/sources`, {
    headers: {
      "Cookie": `access_token=${adminToken}`
    }
  });
  console.log(`- Get Sources List -> Status: ${listSourcesRes.status} (Expected: 200)`);
  if (listSourcesRes.ok) {
    const sources = await listSourcesRes.json();
    const found = sources.some(s => s.id === sourceId);
    console.log(`  Source found in list: ${found ? "YES" : "NO"}`);
  }

  // Delete Source
  if (sourceId) {
    const deleteSourceRes = await fetch(`${baseUrl}/api/admin/sources/${sourceId}`, {
      method: "DELETE",
      headers: {
        "Cookie": `access_token=${adminToken}`
      }
    });
    console.log(`- Delete Source -> Status: ${deleteSourceRes.status} (Expected: 200)`);
  }

  console.log("\n3. FAQS LIBRARY: Testing CRUD Operations...");

  // Create FAQ
  const createFaqRes = await fetch(`${baseUrl}/api/admin/faqs`, {
    method: "POST",
    headers: {
      "Cookie": `access_token=${adminToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: "Is this FAQ created by the audit script?",
      answer: "Yes, it is designed to verify the CMS API."
    })
  });
  console.log(`- Create FAQ -> Status: ${createFaqRes.status} (Expected: 201)`);
  let faqId = "";
  if (createFaqRes.ok) {
    const newFaq = await createFaqRes.json();
    faqId = newFaq.id;
    console.log(`  Created FAQ ID: ${faqId}`);
  }

  // Delete FAQ
  if (faqId) {
    const deleteFaqRes = await fetch(`${baseUrl}/api/admin/faqs/${faqId}`, {
      method: "DELETE",
      headers: {
        "Cookie": `access_token=${adminToken}`
      }
    });
    console.log(`- Delete FAQ -> Status: ${deleteFaqRes.status} (Expected: 200)`);
  }

  console.log("\n4. VALIDATION: Testing Server-Side Zod Validation...");
  
  // Submit Source with missing name
  const malformedSourceRes = await fetch(`${baseUrl}/api/admin/sources`, {
    method: "POST",
    headers: {
      "Cookie": `access_token=${adminToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reference: "Invalid reference, no name field",
      type: "PURANIC"
    })
  });
  console.log(`- Submit malformed Source -> Status: ${malformedSourceRes.status} (Expected: 400)`);
  if (malformedSourceRes.status === 400) {
    const errData = await malformedSourceRes.json();
    console.log(`  Validation error details: ${JSON.stringify(errData)}`);
  }

  console.log("\n=== AUDIT COMPLETED ===");
}

runAudit().catch(console.error);
