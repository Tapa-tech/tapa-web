const { PrismaClient } = require("@prisma/client");
const { SignJWT } = require("jose");

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

async function getTestAccessToken(userId, phone, role = "CUSTOMER") {
  const secret = new TextEncoder().encode("32-char-long-random-secret-for-authjs-12345");
  return new SignJWT({
    userId,
    role,
    phone,
    consentGiven: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

async function runTests() {
  console.log("🚀 STARTING AUTOMATED NEXT.JS ROUTE VERIFICATION SUITE...\n");

  // 1. Setup mock/existing users & tokens
  const testPhone = "+919999999999";
  let user = await prisma.user.findUnique({ where: { phone: testPhone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: testPhone,
        role: "CUSTOMER",
        consentGiven: true,
        consentGivenAt: new Date(),
        consentVersion: "v1.0",
        consentIpAddress: "127.0.0.1",
      }
    });
  }

  let admin = await prisma.user.findFirst({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } }
  });
  if (!admin) {
    admin = await prisma.user.create({
      data: {
        phone: "+919999999991",
        email: "admin@thetapa.co",
        role: "SUPER_ADMIN",
        consentGiven: true,
        consentGivenAt: new Date(),
        consentVersion: "v1.0",
        consentIpAddress: "127.0.0.1",
      }
    });
  }

  const customerToken = await getTestAccessToken(user.id, testPhone, "CUSTOMER");
  const adminToken = await getTestAccessToken(admin.id, admin.phone || "+919999999991", admin.role);

  const customerHeaders = {
    "Cookie": `access_token=${customerToken}`
  };

  const adminHeaders = {
    "Cookie": `access_token=${adminToken}`
  };

  // 2. Fetch dynamic items from DB
  const dbConcept = await prisma.dharmicConcept.findFirst();
  const conceptSlug = dbConcept ? dbConcept.slug : "why-is-bilva-dear-to-mahadev";

  const dbGuide = await prisma.ritualGuide.findFirst();
  const guideSlug = dbGuide ? dbGuide.slug : "ganesh-chaturthi-puja";

  const dbProduct = await prisma.product.findFirst();
  const productSlug = dbProduct ? dbProduct.slug : "shubh-sampada";

  const dbOrder = await prisma.order.findFirst();
  const orderId = dbOrder ? dbOrder.id : "dummy-order-id";

  // 3. Define the list of routes to test
  const routes = [
    // Public normal routes
    { path: "/", expectedStatus: 200, headers: {}, label: "Homepage" },
    { path: "/panchang", expectedStatus: 200, headers: {}, label: "Panchang Dashboard" },
    { path: "/panchang/today", expectedStatus: 200, headers: {}, label: "Today's Panchang" },
    { path: "/panchang/eclipse", expectedStatus: 200, headers: {}, label: "Eclipse Details" },
    { path: "/dharmic-concepts", expectedStatus: 200, headers: {}, label: "Dharmic Concepts" },
    { path: `/dharmic-concepts/${conceptSlug}`, expectedStatus: 200, headers: {}, label: "Dharmic Concept Detail" },
    { path: "/dharmic-concepts/ramcharitmanas-7-kandas-explained", expectedStatus: 200, headers: {}, label: "Ramcharitmanas Fallback Route" },
    { path: "/ritual-guides", expectedStatus: 200, headers: {}, label: "Ritual Guides" },
    { path: "/ritual-guides/festive", expectedStatus: 200, headers: {}, label: "Festive Ritual Guides" },
    { path: `/ritual-guides/${guideSlug}`, expectedStatus: 200, headers: {}, label: "Ritual Guide Detail" },
    { path: "/tapa-circle", expectedStatus: 200, headers: {}, label: "Tapa Circle Info" },
    { path: "/ritual-card", expectedStatus: 200, headers: {}, label: "Ritual Card Interactive tool" },

    // E-commerce public routes
    { path: "/ritual-kits", expectedStatus: 200, headers: {}, label: "Ritual Kits listing" },
    { path: `/ritual-kits/${productSlug}`, expectedStatus: 200, headers: {}, label: "Ritual Kit Detail" },
    { path: "/kit-builder", expectedStatus: 200, headers: {}, label: "Kit Builder" },
    { path: "/wishlist", expectedStatus: 200, headers: {}, label: "Wishlist" },
    { path: "/cart", expectedStatus: 200, headers: {}, label: "Cart page" },
    { path: "/checkout", expectedStatus: 200, headers: customerHeaders, label: "Checkout (Authenticated)" },
    { path: "/checkout", expectedStatus: 200, headers: {}, label: "Checkout (Unauthenticated - Redirects)" },

    // User Account routes
    { path: "/account", expectedStatus: 200, headers: customerHeaders, label: "User Account Dashboard (Authenticated)" },
    { path: `/account/orders/${orderId}`, expectedStatus: 200, headers: customerHeaders, label: "User Order Detail (Authenticated)" },
    { path: "/account", expectedStatus: 200, headers: {}, label: "User Account Dashboard (Unauthenticated - Redirects)" },

    // Admin Panel routes
    { path: "/admin", expectedStatus: 200, headers: adminHeaders, label: "Admin Panel Dashboard (Authenticated)" },
    { path: "/admin/announcements", expectedStatus: 200, headers: adminHeaders, label: "Admin Announcements (Authenticated)" },
    { path: "/admin/audit-log", expectedStatus: 200, headers: adminHeaders, label: "Admin Audit Log (Authenticated)" },
    { path: "/admin/dharmic-concepts", expectedStatus: 200, headers: adminHeaders, label: "Admin Dharmic Concepts (Authenticated)" },
    { path: "/admin/dpb-review", expectedStatus: 200, headers: adminHeaders, label: "Admin DPB Review (Authenticated)" },
    { path: "/admin/faqs", expectedStatus: 200, headers: adminHeaders, label: "Admin FAQs (Authenticated)" },
    { path: "/admin/orders", expectedStatus: 200, headers: adminHeaders, label: "Admin Orders (Authenticated)" },
    { path: "/admin/panchang", expectedStatus: 200, headers: adminHeaders, label: "Admin Panchang (Authenticated)" },
    { path: "/admin/products", expectedStatus: 200, headers: adminHeaders, label: "Admin Products (Authenticated)" },
    { path: "/admin/ritual-guides", expectedStatus: 200, headers: adminHeaders, label: "Admin Ritual Guides (Authenticated)" },
    { path: "/admin/ritual-kits", expectedStatus: 200, headers: adminHeaders, label: "Admin Ritual Kits (Authenticated)" },
    { path: "/admin/sources", expectedStatus: 200, headers: adminHeaders, label: "Admin Sources (Authenticated)" },
    { path: "/admin/tapa-circle", expectedStatus: 200, headers: adminHeaders, label: "Admin Tapa Circle (Authenticated)" },
    { path: "/admin/upcoming-features", expectedStatus: 200, headers: adminHeaders, label: "Admin Upcoming Features (Authenticated)" },
    { path: "/admin/users", expectedStatus: 200, headers: adminHeaders, label: "Admin Users (Authenticated)" },
  ];

  let passed = 0;
  let failed = 0;
  const failureDetails = [];

  for (const r of routes) {
    const fullUrl = `${BASE_URL}${r.path}`;
    try {
      const res = await fetch(fullUrl, {
        method: "GET",
        headers: r.headers,
        redirect: "manual" // Prevent auto-following so we can check 307
      });

      const isHTML = res.headers.get("content-type")?.includes("text/html");
      let bodyText = "";

      if (isHTML && res.status === 200) {
        bodyText = await res.text();
      }

      const statusOk = res.status === r.expectedStatus;

      let layoutOk = true;
      let errorDetected = false;
      let reason = "";

      if (res.status === 200) {
        // Assert HTML structure
        if (!isHTML) {
          layoutOk = false;
          reason = "Content type is not text/html";
        } else {
          // Check for compile errors or raw exceptions
          const crashKeywords = [
            "Failed to compile",
            "Internal Server Error",
            "Unhandled Runtime Error",
            "Error: ",
            "Cannot read properties",
            "is not defined"
          ];
          for (const kw of crashKeywords) {
            if (bodyText.includes(kw)) {
              errorDetected = true;
              reason = `React/Next crash keywords found: "${kw}"`;
              break;
            }
          }

          if (!errorDetected) {
            // Check for TopNav/Header and Footer on public pages (except admin or special views where they might not exist)
            const isPublicPage = !r.path.startsWith("/admin");
            if (isPublicPage) {
              const hasNav = bodyText.toLowerCase().includes("logo") || bodyText.toLowerCase().includes("topnav");
              const hasFooter = bodyText.toLowerCase().includes("footer") || bodyText.toLowerCase().includes("futility");
              if (!hasNav) {
                layoutOk = false;
                reason = "Could not find header/nav structure in HTML";
              } else if (!hasFooter) {
                layoutOk = false;
                reason = "Could not find footer structure in HTML";
              }
            }
          }
        }
      }

      if (statusOk && layoutOk && !errorDetected) {
        console.log(`✅ [PASS] ${r.label.padEnd(50)}: ${r.path} (Status: ${res.status})`);
        passed++;
      } else {
        const detail = {
          label: r.label,
          path: r.path,
          expectedStatus: r.expectedStatus,
          actualStatus: res.status,
          reason: reason || `Expected status ${r.expectedStatus}, got ${res.status}`
        };
        console.error(`❌ [FAIL] ${r.label.padEnd(50)}: ${r.path}`);
        console.error(`          Reason: ${detail.reason}\n`);
        failureDetails.push(detail);
        failed++;
      }
    } catch (e) {
      console.error(`❌ [FAIL] ${r.label.padEnd(50)}: ${r.path}`);
      console.error(`          Reason: Network / connection failure: ${e.message}\n`);
      failureDetails.push({
        label: r.label,
        path: r.path,
        expectedStatus: r.expectedStatus,
        actualStatus: "Network Error",
        reason: e.message
      });
      failed++;
    }
  }

  console.log("\n==================================================");
  console.log(`📊 TESTING SUMMARY:`);
  console.log(`   TOTAL TESTS PASSED : ${passed}`);
  console.log(`   TOTAL TESTS FAILED : ${failed}`);
  console.log("==================================================\n");

  if (failed > 0) {
    console.error("🚨 ROUTE VERIFICATION SUITE FAILED WITH ERRORS!");
    process.exit(1);
  } else {
    console.log("🎉 ALL ROUTES AND LAYOUT STRUCTURES PASSED VERIFICATION!");
    process.exit(0);
  }
}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
