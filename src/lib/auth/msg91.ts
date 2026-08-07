export async function sendSMSOTP(phone: string, otp: string): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  // Always log the code locally for easy testing and debugging
  console.log(`\n==================================================`);
  console.log(`[SMS OTP PORTAL] Verification Code for ${phone}: ${otp}`);
  console.log(`==================================================\n`);

  // If using mock credentials, skip the HTTP API call and succeed
  if (
    !authKey ||
    authKey.startsWith("mock") ||
    !templateId ||
    templateId.startsWith("mock")
  ) {
    return true;
  }

  try {
    // MSG91 expects phone number without '+' prefix (e.g. 91XXXXXXXXXX)
    const cleanPhone = phone.replace("+", "");
    const url = `https://control.msg91.com/api/v5/otp?otp=${otp}&mobile=${cleanPhone}&authkey=${authKey}&template_id=${templateId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`MSG91 returned status: ${response.status}`);
      return false;
    }

    const data = await response.json();
    return data.type === "success";
  } catch (error) {
    console.error("Failed to connect to MSG91 API gateway:", error);
    return false;
  }
}
