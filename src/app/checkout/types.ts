export type PaymentMethod = "COD" | "UPI" | "CARD" | "NETBANKING";

export interface CheckoutAddress {
  name: string;
  mobile: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
}
