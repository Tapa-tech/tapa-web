export interface AnalyticsEventData {
  productId?: string;
  productName?: string;
  price?: number;
  quantity?: number;
  totalAmount?: number;
  orderId?: string;
  category?: string;
}

// Stub for the Facebook/Google Pixel setup
export function initMarketingPixel() {
  if (typeof window === "undefined") return;

  const PIXEL_ID = process.env.NEXT_PUBLIC_MARKETING_PIXEL_ID || "MOCK_PIXEL_12345";
  console.log(`[ANALYTICS] Initializing Marketing Pixel with ID: ${PIXEL_ID}`);

  // Inject Facebook Pixel snippet (stubbed template)
  const win = window as any;
  if (!win.fbq) {
    win.fbq = function (...args: any[]) {
      console.log("[PIXEL EVENT (FBQ)]", ...args);
      win.fbq.queue = win.fbq.queue || [];
      win.fbq.queue.push(args);
    };
    win.fbq.queue = [];
  }

  // Inject Google Tag/Analytics snippet (stubbed template)
  if (!win.gtag) {
    win.gtag = function (...args: any[]) {
      console.log("[PIXEL EVENT (GTAG)]", ...args);
    };
  }
}

// Core tracking functions
export function trackPageView(url: string) {
  if (typeof window === "undefined") return;
  console.log(`[ANALYTICS] Page View: ${url}`);
  
  const win = window as any;
  if (win.fbq) win.fbq("track", "PageView");
  if (win.gtag) win.gtag("event", "page_view", { page_path: url });
}

export function trackProductView(productId: string, productName: string, price: number, category?: string) {
  if (typeof window === "undefined") return;
  console.log(`[ANALYTICS] Product View: ${productName} (ID: ${productId}, Price: ₹${price})`);

  const win = window as any;
  if (win.fbq) {
    win.fbq("track", "ViewContent", {
      content_ids: [productId],
      content_name: productName,
      value: price,
      currency: "INR",
      content_type: "product",
      content_category: category,
    });
  }
  if (win.gtag) {
    win.gtag("event", "view_item", {
      currency: "INR",
      value: price,
      items: [{ item_id: productId, item_name: productName, price, quantity: 1, item_category: category }],
    });
  }
}

export function trackAddToCart(productId: string, productName: string, price: number, quantity = 1, category?: string) {
  if (typeof window === "undefined") return;
  console.log(`[ANALYTICS] Add to Cart: ${productName} (Qty: ${quantity}, Price: ₹${price})`);

  const win = window as any;
  if (win.fbq) {
    win.fbq("track", "AddToCart", {
      content_ids: [productId],
      content_name: productName,
      value: price * quantity,
      currency: "INR",
      content_type: "product",
      content_category: category,
    });
  }
  if (win.gtag) {
    win.gtag("event", "add_to_cart", {
      currency: "INR",
      value: price * quantity,
      items: [{ item_id: productId, item_name: productName, price, quantity, item_category: category }],
    });
  }
}

export function trackCheckoutInitiation(totalAmount: number, itemCount: number) {
  if (typeof window === "undefined") return;
  console.log(`[ANALYTICS] Checkout Initiated: Total: ₹${totalAmount}, Items count: ${itemCount}`);

  const win = window as any;
  if (win.fbq) {
    win.fbq("track", "InitiateCheckout", {
      value: totalAmount,
      currency: "INR",
      num_items: itemCount,
    });
  }
  if (win.gtag) {
    win.gtag("event", "begin_checkout", {
      currency: "INR",
      value: totalAmount,
    });
  }
}

export function trackPurchase(orderId: string, totalAmount: number, items: Array<{ productId: string; productName: string; price: number; quantity: number }>) {
  if (typeof window === "undefined") return;
  console.log(`[ANALYTICS] Purchase: Order #${orderId}, Total: ₹${totalAmount}`);
  // TODO: Razorpay Hook Conversion - online payment webhook needs to trigger a similar event on successful capture.

  const win = window as any;
  if (win.fbq) {
    win.fbq("track", "Purchase", {
      content_ids: items.map(item => item.productId),
      value: totalAmount,
      currency: "INR",
      order_id: orderId,
      content_type: "product",
    });
  }
  if (win.gtag) {
    win.gtag("event", "purchase", {
      transaction_id: orderId,
      value: totalAmount,
      currency: "INR",
      items: items.map(item => ({
        item_id: item.productId,
        item_name: item.productName,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
}

export function trackSubscriptionOptIn(whatsappNumber: string) {
  if (typeof window === "undefined") return;
  console.log(`[ANALYTICS] Tapa Circle Subscription Opt-In: (WhatsApp: ${whatsappNumber})`);

  const win = window as any;
  if (win.fbq) {
    win.fbq("track", "Lead", {
      content_category: "Tapa Circle",
      content_name: "Subscription Opt-in",
    });
  }
  if (win.gtag) {
    win.gtag("event", "generate_lead", {
      lead_category: "Tapa Circle",
    });
  }
}
