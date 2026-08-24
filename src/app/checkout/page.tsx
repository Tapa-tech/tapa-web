"use client";

import React from "react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useCheckout } from "./hooks/useCheckout";
import { CheckoutAddressForm } from "./components/CheckoutAddressForm";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { OrderSummary } from "./components/OrderSummary";
import { CheckoutToast } from "./components/CheckoutToast";

export default function CheckoutPage() {
  const {
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
  } = useCheckout();

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />
          <div className="flex items-center justify-center py-40">
            <Loader2 className="w-8 h-8 animate-spin text-[#C82A54]" />
          </div>
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-body-text font-sans antialiased plp-container">
      <AnnouncementBar />
      <TopNav activeTab="Ritual Kits" onTriggerToast={triggerToast} />

      
      <div className="breadcrumb-bar select-none">
        <div className="wrap">
          <a href="/" className="hover:underline">Home</a>
          <span className="bc-sep">›</span>
          <a href="/cart" className="hover:underline">Cart</a>
          <span className="bc-sep">›</span>
          <span className="bc-current">Checkout</span>
        </div>
      </div>

      <div className="max-w-[var(--content-w)] mx-auto px-4 md:px-10 py-8 pb-20">
        <h1 className="font-serif font-bold text-3xl text-dark mb-6">Delivery &amp; Payment</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          
          
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <CheckoutAddressForm
              name={name}
              setName={setName}
              mobile={mobile}
              setMobile={setMobile}
              addressLine1={addressLine1}
              setAddressLine1={setAddressLine1}
              addressLine2={addressLine2}
              setAddressLine2={setAddressLine2}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              pincode={pincode}
              setPincode={setPincode}
              saveAddress={saveAddress}
              setSaveAddress={setSaveAddress}
            />

            
            <PaymentMethodSelector
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              codDisabledInfo={codDisabledInfo}
            />

            
            <div className="flex justify-between items-center select-none pt-2">
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="flex items-center gap-2 text-xs font-bold text-[#C82A54] hover:underline"
              >
                <ArrowLeft size={14} />
                <span>Return to Cart</span>
              </button>

              <button
                type="submit"
                disabled={submitting || codDisabledInfo.disabled || items.length === 0}
                className="bg-[#C82A54] hover:bg-[#B02047] disabled:bg-gray-400 text-white border-none rounded-xl px-8 py-3.5 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer select-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Placing your order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={14} />
                    <span>Confirm &amp; Place Order</span>
                  </>
                )}
              </button>
            </div>
          </form>

          
          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            totalAmount={totalAmount}
          />

        </div>
      </div>

      <Footer onTriggerToast={triggerToast} />

      
      <CheckoutToast message={toastMessage} />
    </div>
  );
}
