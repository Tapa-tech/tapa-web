import http from "k6/http";
import { sleep, check } from "k6";

// Load test options: 50 concurrent virtual users ramping up to 100, then ramping down.
export const options = {
  stages: [
    { duration: "15s", target: 50 },  // Ramp-up to 50 concurrent users
    { duration: "30s", target: 100 }, // Hold at 100 concurrent users
    { duration: "15s", target: 0 },   // Ramp-down to 0
  ],
  thresholds: {
    // 95% of requests must complete in less than 500ms
    http_req_duration: ["p(95)<500"],
    // Error rate must be less than 1% under load
    http_req_failed: ["rate<0.01"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  // Generate a random valid Indian mobile phone number (+91XXXXXXXXXX) to prevent duplicate key conflicts
  const randomMobileSuffix = Math.floor(6000000000 + Math.random() * 4000000000);
  const phone = `+91${randomMobileSuffix}`;

  const headers = { "Content-Type": "application/json" };

  // 1. Simulate requesting an OTP (Step A)
  const requestPayload = JSON.stringify({ phone });
  const reqResponse = http.post(`${BASE_URL}/api/otp/request`, requestPayload, { headers });
  
  check(reqResponse, {
    "OTP request responds 200 or 429": (r) => r.status === 200 || r.status === 429,
  });

  sleep(0.5);

  // 2. Simulate checking current session state (Stateless Access Token Verification)
  const sessionResponse = http.get(`${BASE_URL}/api/auth/session`);
  check(sessionResponse, {
    "Session fetch responds 200": (r) => r.status === 200,
  });

  sleep(1);
}
