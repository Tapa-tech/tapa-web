import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cartStore";
import { trackPageView, trackPurchase } from "@/lib/analytics";
import { PaymentMethod } from "../types";

export function useCheckout() {
  const router = useRouter();

  
  const { items, fetchCart, checkAuth, clearCart } = useCartStore();

  
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [saveAddress, setSaveAddress] = useState(true);

  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("COD");

  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  
  useEffect(() => {
    trackPageView("/checkout");
  }, []);

  
  useEffect(() => {
    const saved = localStorage.getItem("tapa-saved-address");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.mobile) setMobile(parsed.mobile);
        if (parsed.addressLine1) setAddressLine1(parsed.addressLine1);
        if (parsed.addressLine2) setAddressLine2(parsed.addressLine2);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.pincode) setPincode(parsed.pincode);
      } catch (e) {
        console.error("Failed to parse saved address:", e);
      }
    }
  }, []);

  
  useEffect(() => {
    async function initCheckout() {
      const authed = await checkAuth();
      if (!authed) {
        triggerToast("Please log in to proceed to checkout.");
        router.push("/cart?login=true");
        return;
      }
      await fetchCart();
      setIsInitialLoading(false);
    }
    initCheckout();
  }, [checkAuth, fetchCart, router]);

  
  useEffect(() => {
    if (!isInitialLoading && !submitting && items.length === 0) {
      router.push("/cart");
    }
  }, [isInitialLoading, items, submitting, router]);

  
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 1500 ? 0 : 99;
  const totalAmount = subtotal + deliveryFee;

  const restrictedItem = items.find((item) => item.codAvailability === "NOT_AVAILABLE");
  const codDisabledInfo = restrictedItem
    ? { disabled: true, itemName: restrictedItem.name }
    : { disabled: false, itemName: "" };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (items.length === 0) {
      triggerToast("Your cart is empty.");
      return;
    }

    if (codDisabledInfo.disabled) {
      triggerToast(`Order cannot be placed: ${codDisabledInfo.itemName} is not eligible for Cash on Delivery.`);
      return;
    }

    if (selectedPayment !== "COD") {
      triggerToast("Only Cash on Delivery is currently supported.");
      return;
    }

    setSubmitting(true);

    const addressSnapshot = {
      name,
      mobile,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: addressSnapshot,
          paymentMethod: "COD",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        
        const orderItemsMap = items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
        }));
        trackPurchase(data.orderNumber, totalAmount, orderItemsMap);

        
        clearCart();

        if (saveAddress) {
          localStorage.setItem("tapa-saved-address", JSON.stringify(addressSnapshot));
          triggerToast("Address saved. Placing your order...");
        } else {
          triggerToast("Placing your order...");
        }

        
        setTimeout(() => {
          router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}&amount=${totalAmount}`);
        }, 1500);
      } else {
        triggerToast(data.error || "Failed to place order.");
        setSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      triggerToast("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  return {
    items,
    isInitialLoading,
    submitting,
    name,
    setName,
    mobile,
    setMobile,
    addressLine1,
    setAddressLine1,
    addressLine2,
    setAddressLine2,
    city,
    setCity,
    state,
    setState,
    pincode,
    setPincode,
    saveAddress,
    setSaveAddress,
    selectedPayment,
    setSelectedPayment,
    toastMessage,
    triggerToast,
    subtotal,
    deliveryFee,
    totalAmount,
    codDisabledInfo,
    handleSubmitOrder,
    router,
  };
}
