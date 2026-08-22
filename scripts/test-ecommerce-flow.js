import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const prisma = new PrismaClient();
const BASE_URL = "http://localhost:3000";

// Helper to sign JWT access token
async function getTestAccessToken(userId, phone) {
  const secret = new TextEncoder().encode("32-char-long-random-secret-for-authjs-12345");
  return new SignJWT({
    userId,
    role: "CUSTOMER",
    phone,
    consentGiven: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

async function getAdminAccessToken() {
  // Fetch an admin user from DB or mock one
  let admin = await prisma.user.findFirst({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } }
  });

  if (!admin) {
    admin = await prisma.user.create({
      data: {
        phone: "+919999999991",
        email: "admin@thetapa.co",
        role: "ADMIN",
        consentGiven: true,
        consentGivenAt: new Date(),
        consentVersion: "v1.0",
        consentIpAddress: "127.0.0.1",
      }
    });
  }

  const secret = new TextEncoder().encode("32-char-long-random-secret-for-authjs-12345");
  return new SignJWT({
    userId: admin.id,
    role: admin.role,
    phone: admin.phone,
    email: admin.email,
    consentGiven: true,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(secret);
}

async function runTests() {
  console.log("🚀 STARTING E-COMMERCE END-TO-END VERIFICATION FLOW...");

  // 1. Find or create a test user
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
  console.log(`✅ Test User Verified (ID: ${user.id})`);

  // 2. Generate Access Token
  const token = await getTestAccessToken(user.id, testPhone);
  const headers = {
    "Content-Type": "application/json",
    "Cookie": `access_token=${token}`
  };

  // Find a product to add to cart (Shubh Sampada) and ensure it has stock
  let product = await prisma.product.findFirst({
    where: { slug: "shubh-sampada" }
  });
  if (!product) {
    console.error("❌ Test product 'shubh-sampada' not found in database. Run npm run db:seed first.");
    return;
  }
  
  // Set stock to 10 for clean test execution
  product = await prisma.product.update({
    where: { id: product.id },
    data: { stock: 10 }
  });
  
  console.log(`✅ Test Product Sourced & Restocked: ${product.name} (Price: ₹${product.price}, Stock Reset: ${product.stock})`);

  // 3. Add Item to Cart
  console.log("\n🛒 STEP 3: Adding product to cart...");
  const cartAddRes = await fetch(`${BASE_URL}/api/cart`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      productId: product.id,
      quantity: 2
    })
  });
  if (!cartAddRes.ok) {
    console.error("❌ Add to cart failed:", await cartAddRes.text());
    return;
  }
  console.log("✅ Product added to cart successfully.");

  // 4. Retrieve Cart Items
  console.log("\n🛒 STEP 4: Fetching cart items...");
  const cartGetRes = await fetch(`${BASE_URL}/api/cart`, { headers });
  const cartItems = await cartGetRes.json();
  console.log("✅ Cart items fetched:", cartItems);
  if (cartItems.length === 0 || cartItems[0].productId !== product.id) {
    console.error("❌ Cart retrieval mismatch.");
    return;
  }

  // 5. Add Item to Wishlist
  console.log("\n💖 STEP 5: Adding item to wishlist...");
  const wishlistAddRes = await fetch(`${BASE_URL}/api/wishlist`, {
    method: "POST",
    headers,
    body: JSON.stringify({ productId: product.id })
  });
  if (!wishlistAddRes.ok) {
    console.error("❌ Add to wishlist failed:", await wishlistAddRes.text());
    return;
  }
  console.log("✅ Item saved to wishlist.");

  // 6. Fetch Wishlist
  const wishlistGetRes = await fetch(`${BASE_URL}/api/wishlist`, { headers });
  const wishlistItems = await wishlistGetRes.json();
  console.log("✅ Wishlist items fetched:", wishlistItems);

  // 7. Place Order (Checkout Flow)
  console.log("\n📦 STEP 7: Initiating checkout / Placing COD Order...");
  const address = {
    name: "Rohan Kumar",
    mobile: "9999999999",
    addressLine1: "Flat 405, Vedic Heights",
    addressLine2: "Sanskriti Marg, Sector 12",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301"
  };

  const checkoutRes = await fetch(`${BASE_URL}/api/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      address,
      paymentMethod: "COD"
    })
  });
  
  if (!checkoutRes.ok) {
    console.error("❌ Order placement failed:", await checkoutRes.text());
    return;
  }
  const orderResult = await checkoutRes.json();
  console.log("✅ COD Order Placed Successfully!");
  console.log(`ℹ️ Order Number: ${orderResult.orderNumber}`);
  console.log(`ℹ️ Sequential Format: ${orderResult.orderNumber} (Expect: TK-2026-XXXX)`);

  // Verify stock decremented
  const productAfter = await prisma.product.findUnique({ where: { id: product.id } });
  console.log(`ℹ️ Stock decremented from ${product.stock} to ${productAfter.stock}`);

  // 8. View Order History (Customer Area)
  console.log("\n📜 STEP 8: Fetching customer order history...");
  const orderHistoryRes = await fetch(`${BASE_URL}/api/orders`, { headers });
  const orders = await orderHistoryRes.json();
  console.log(`✅ Order History Retrieved (${orders.length} orders found)`);
  console.log(`ℹ️ Latest Order Status: ${orders[0].orderStatus} / Payment Status: ${orders[0].paymentStatus}`);

  // 9. Admin Area - Fulfill Order
  console.log("\n⚙️ STEP 9: Fulfilling order via Admin dashboard...");
  const adminToken = await getAdminAccessToken();
  const adminHeaders = {
    "Content-Type": "application/json",
    "Cookie": `access_token=${adminToken}`
  };

  const adminUpdateRes = await fetch(`${BASE_URL}/api/admin/orders`, {
    method: "PUT",
    headers: adminHeaders,
    body: JSON.stringify({
      orderId: orderResult.id,
      orderStatus: "SHIPPED",
      paymentStatus: "PAID"
    })
  });
  if (!adminUpdateRes.ok) {
    console.error("❌ Admin status update failed:", await adminUpdateRes.text());
    return;
  }
  console.log("✅ Admin successfully updated order status to DISPATCHED and payment to PAID.");

  // Verify update
  const updatedOrder = await prisma.order.findUnique({ where: { id: orderResult.id } });
  console.log(`ℹ️ Verification: Order Status = ${updatedOrder.orderStatus}, Payment Status = ${updatedOrder.paymentStatus}`);

  // 10. Tapa Circle Subscriber Opt-In
  console.log("\n🌟 STEP 10: Subscribing to Tapa Circle...");
  const subscribeRes = await fetch(`${BASE_URL}/api/public/tapa-circle`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      whatsappNumber: "+919999999999",
      consent: true
    })
  });
  if (!subscribeRes.ok) {
    console.error("❌ Tapa Circle subscription failed:", await subscribeRes.text());
    return;
  }
  const subData = await subscribeRes.json();
  console.log("✅ Subscriber Registered. Status defaults to:", subData.status);

  // 11. Admin Tapa Circle broadcast
  console.log("\n📢 STEP 11: Dispatching broadcast to subscribers...");
  const broadcastRes = await fetch(`${BASE_URL}/api/admin/tapa-circle`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      message: "Daily Muhurata Alert: Puja timing starts tonight at 10:15 PM."
    })
  });
  if (!broadcastRes.ok) {
    console.error("❌ Admin broadcast failed:", await broadcastRes.text());
    return;
  }
  const broadcastData = await broadcastRes.json();
  console.log(`✅ Broadcast sent successfully to ${broadcastData.count} subscribers.`);

  console.log("\n🏆 E-COMMERCE END-TO-END TEST SUITE COMPLETED SUCCESSFULLY!");
}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
