const http = require("http");

const PAGES_TO_TEST = [
  "/",
  "/ritual-guides",
  "/ritual-guides/hartalika-teej",
  "/ritual-kits",
  "/ritual-kits/trimshat-deepam",
  "/dharmic-concepts",
  "/dharmic-concepts/ganesh-chaturthi-beginners",
  "/dharmic-concepts/ramcharitmanas-7-kandas-explained",
  "/panchang",
  "/panchang/today",
  "/cart",
  "/checkout",
  "/api/public/home",
  "/api/public/products",
  "/api/public/ritual-guides",
  "/api/public/panchang",
  "/api/public/upcoming-features",
  "/api/public/announcements"
];

function testUrl(url) {
  return new Promise((resolve) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: url,
      method: "GET",
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({
          url,
          statusCode: res.statusCode,
          success: res.statusCode === 200,
          error: res.statusCode !== 200 ? `Status Code: ${res.statusCode}` : null
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        url,
        statusCode: 0,
        success: false,
        error: err.message
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log("=== Starting Webapp Page Health Audit ===");
  console.log("Testing server: http://localhost:3000\n");

  const results = [];
  for (const page of PAGES_TO_TEST) {
    console.log(`Checking ${page}...`);
    const res = await testUrl(page);
    results.push(res);
  }

  console.log("\n=== Audit Report ===");
  let failures = 0;
  
  results.forEach((r) => {
    if (r.success) {
      console.log(`✅ ${r.url} - 200 OK`);
    } else {
      console.log(`❌ ${r.url} - FAILED (${r.error})`);
      failures++;
    }
  });

  console.log("\n=====================");
  if (failures === 0) {
    console.log("🎉 SUCCESS: All audited pages and API endpoints return 200 OK with zero errors!");
  } else {
    console.log(`⚠️ WARNING: ${failures} page(s) failed the audit. Inspect the logs above.`);
    process.exit(1);
  }
}

runTests();
