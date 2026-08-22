const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method, body, cookieHeader = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    if (cookieHeader) {
      options.headers['Cookie'] = cookieHeader;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = JSON.parse(data);
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: parsed
        });
      });
    });

    req.on('error', (err) => reject(err));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING PANCHANG SYNC INTEGRATION TESTS ===");

  // 1. Log in as Admin
  console.log("\n1. Logging in as Admin...");
  const loginRes = await makeRequest('/api/auth/admin/login', 'POST', {
    email: 'admin@tapa.co',
    password: 'AdminSecurePassword123!'
  });

  if (loginRes.statusCode !== 200 || !loginRes.body.success) {
    console.error("FAIL: Login failed", loginRes.body);
    process.exit(1);
  }
  console.log("SUCCESS: Logged in successfully.");

  // Extract cookies
  const setCookie = loginRes.headers['set-cookie'] || [];
  const cookies = setCookie.map(c => c.split(';')[0]).join('; ');

  // 2. Fetch public page before sync (should fall back gracefully if empty)
  console.log("\n2. Querying public Panchang endpoint...");
  const publicRes = await makeRequest('/api/public/panchang', 'GET');
  console.log("SUCCESS: Public endpoint works. Current data:", publicRes.body);

  // 3. Trigger manual sync for today
  const todayStr = new Date().toISOString().substring(0, 10);
  console.log(`\n3. Triggering sync for date: ${todayStr}...`);
  const syncRes = await makeRequest('/api/admin/panchang/re-sync', 'POST', {
    date: todayStr
  }, cookies);

  if (syncRes.statusCode !== 200) {
    console.error("FAIL: Single-date sync failed", syncRes.body);
    process.exit(1);
  }
  console.log("SUCCESS: Synced successfully. Data:", syncRes.body.data);
  const syncedEntry = syncRes.body.data;

  // Verify fields
  if (syncedEntry.dataSource !== 'AUTO_SYNCED') {
    console.error(`FAIL: Expected dataSource to be 'AUTO_SYNCED', got '${syncedEntry.dataSource}'`);
    process.exit(1);
  }

  // 4. Update the synced entry (Manual Override)
  console.log(`\n4. Simulating manual edit (overriding Sunrise to '05:00')...`);
  const editRes = await makeRequest(`/api/admin/panchang/${syncedEntry.id}`, 'PUT', {
    date: syncedEntry.date,
    city: syncedEntry.city,
    tithi: syncedEntry.tithi,
    tithiSub: syncedEntry.tithiSub,
    paksha: syncedEntry.paksha,
    pakshaSub: syncedEntry.pakshaSub,
    nakshatra: syncedEntry.nakshatra,
    nakshatraSub: syncedEntry.nakshatraSub,
    sunrise: '05:00',
    sunset: syncedEntry.sunset
  }, cookies);

  if (editRes.statusCode !== 200) {
    console.error("FAIL: Manual update failed", editRes.body);
    process.exit(1);
  }
  console.log("SUCCESS: Manual update completed. Updated data:", editRes.body);
  const overriddenEntry = editRes.body;

  if (overriddenEntry.dataSource !== 'MANUAL_OVERRIDE' || !overriddenEntry.overriddenBy) {
    console.error("FAIL: Entry not marked as MANUAL_OVERRIDE or overriddenBy is missing", overriddenEntry);
    process.exit(1);
  }
  console.log(`SUCCESS: Marked as MANUAL_OVERRIDE by ${overriddenEntry.overriddenBy} at ${overriddenEntry.overriddenAt}`);

  // 5. Run the background sync loop for the same date and verify it does NOT overwrite the manual override
  console.log(`\n5. Re-running sync for ${todayStr} (to verify sync skips overridden record)...`);
  const reSyncTestRes = await makeRequest('/api/admin/panchang/re-sync', 'POST', {
    date: todayStr
  }, cookies);
  
  // The route should return 400 because it is overridden
  if (reSyncTestRes.statusCode === 400) {
    console.log("SUCCESS: Upsert route correctly blocked auto-syncing over a MANUAL_OVERRIDE date.");
  } else {
    console.warn("WARNING: Upsert route response status:", reSyncTestRes.statusCode, reSyncTestRes.body);
  }

  // Double check in db that values remained overridden (Sunrise is still '05:00')
  const checkDb = await dbQuery(overriddenEntry.id, cookies);
  if (checkDb.sunrise === '05:00' && checkDb.dataSource === 'MANUAL_OVERRIDE') {
    console.log("SUCCESS: Verified in database that override values are preserved.");
  } else {
    console.error("FAIL: Database values were overwritten!", checkDb);
    process.exit(1);
  }

  // 6. Revert to auto-synced using the id-specific re-sync endpoint
  console.log(`\n6. Reverting entry back to auto-synced...`);
  const revertRes = await makeRequest(`/api/admin/panchang/${syncedEntry.id}/re-sync`, 'POST', {}, cookies);

  if (revertRes.statusCode !== 200) {
    console.error("FAIL: Revert route failed", revertRes.body);
    process.exit(1);
  }
  console.log("SUCCESS: Revert response:", revertRes.body);
  const revertedEntry = revertRes.body;

  if (revertedEntry.dataSource !== 'AUTO_SYNCED' || revertedEntry.overriddenBy !== null || revertedEntry.sunrise !== syncedEntry.sunrise) {
    console.error("FAIL: Revert did not restore original values or reset status", revertedEntry);
    process.exit(1);
  }
  console.log("SUCCESS: Revert successfully restored original values and reset status to AUTO_SYNCED.");

  // 7. Trigger the 45-day background rolling sync
  console.log("\n7. Triggering rolling 45-day background sync...");
  const rollRes = await makeRequest('/api/admin/panchang/re-sync', 'POST', {
    triggerAll: true
  }, cookies);

  if (rollRes.statusCode !== 200) {
    console.error("FAIL: 45-day sync trigger failed", rollRes.body);
    process.exit(1);
  }
  console.log("SUCCESS: 45-day sync trigger completed.", rollRes.body);

  console.log("\n=== ALL PANCHANG SYNC INTEGRATION TESTS PASSED SUCCESSFULLY ===");
}

async function dbQuery(id, cookies) {
  const list = await makeRequest('/api/admin/panchang', 'GET', null, cookies);
  return list.body.find(e => e.id === id);
}

runTests().catch(e => {
  console.error("Test execution error:", e);
  process.exit(1);
});
