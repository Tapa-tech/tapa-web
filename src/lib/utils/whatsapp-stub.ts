export interface WhatsAppRecipient {
  userId: string;
  whatsappNumber: string;
  name?: string | null;
}

/**
 * Sends a manual broadcast message to all active subscribers.
 * 
 * TODO: WhatsApp Business API integration - see Prompt #11 Section 7
 */
export async function sendBroadcast(message: string, subscribers: WhatsAppRecipient[]) {
  console.log(`\n================== [WHATSAPP BROADCAST STUB] ==================`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Message Content: "${message}"`);
  console.log(`Recipients Count: ${subscribers.length}`);
  console.log("Recipients Detail:");
  subscribers.forEach((sub, idx) => {
    console.log(`  [${idx + 1}] User ID: ${sub.userId}, Phone: ${sub.whatsappNumber}, Name: ${sub.name || "Guest"}`);
  });
  console.log(`================================================================\n`);

  return {
    success: true,
    recipientsCount: subscribers.length,
  };
}

/**
 * Sends transactional order/payment confirmation notification.
 * 
 * TODO: WhatsApp Business API integration - see Prompt #11 Section 7
 */
export async function sendOrderConfirmationNotification(orderNumber: string, phone: string, amount: number) {
  console.log(`\n================= [WHATSAPP TRANSACTIONAL STUB] =================`);
  console.log(`Type: ORDER_CONFIRMATION`);
  console.log(`Order Number: ${orderNumber}`);
  console.log(`Phone Number: ${phone}`);
  console.log(`Amount: ₹${amount}`);
  console.log(`Message: "Hare Krishna! Your order #${orderNumber} for ₹${amount} is confirmed. It will be delivered via Cash on Delivery soon. Thank you!"`);
  console.log(`=================================================================\n`);

  return { success: true };
}
