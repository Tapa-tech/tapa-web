import React from "react";
import { PaymentMethod } from "../types";

interface PaymentMethodSelectorProps {
  selectedPayment: PaymentMethod;
  setSelectedPayment: (method: PaymentMethod) => void;
  codDisabledInfo: {
    disabled: boolean;
    itemName: string;
  };
}

const ONLINE_PAYMENT_OPTIONS = [
  { value: "UPI", label: "UPI (GPay, PhonePe, Paytm)" },
  { value: "CARD", label: "Credit / Debit Card" },
  { value: "NETBANKING", label: "Net banking" },
] as const;

export function PaymentMethodSelector({
  selectedPayment,
  setSelectedPayment,
  codDisabledInfo,
}: PaymentMethodSelectorProps) {
  return (
    <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
      <h2 className="font-serif font-bold text-lg text-dark border-b border-[#F2ECE4] pb-3">Payment Method</h2>
      
      {codDisabledInfo.disabled && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-semibold leading-relaxed">
          ⚠️ <strong>Cash on Delivery unavailable</strong>: &quot;{codDisabledInfo.itemName}&quot; has restricted COD eligibility. Since online payment is currently coming soon, please remove this item to check out via COD.
        </div>
      )}

      <div className="space-y-3 font-sans">
        {/* COD Option */}
        <label
          className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
            codDisabledInfo.disabled
              ? "opacity-40 cursor-not-allowed border-border"
              : selectedPayment === "COD"
              ? "border-[#C82A54] bg-[#FFEAEF]/5"
              : "border-border hover:border-pink"
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              disabled={codDisabledInfo.disabled}
              checked={selectedPayment === "COD"}
              onChange={() => setSelectedPayment("COD")}
              className="w-4 h-4 text-[#C82A54] focus:ring-[#C82A54]"
            />
            <div>
              <div className="text-sm font-bold text-dark">Cash on Delivery (COD)</div>
              <div className="text-[10px] text-[#8A7A6E] mt-0.5">Pay physically in cash or via UPI at delivery.</div>
            </div>
          </div>
          <span className="text-xs font-bold text-green-600">Active</span>
        </label>

        {/* Online Payment Stub Options */}
        {ONLINE_PAYMENT_OPTIONS.map((opt) => (
          <div
            key={opt.value}
            className="flex items-center justify-between p-4 border border-border bg-gray-50 rounded-xl opacity-60 cursor-not-allowed select-none"
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                disabled
                className="w-4 h-4 text-gray-400"
              />
              <div>
                <div className="text-sm font-semibold text-dark">{opt.label}</div>
                <div className="text-[10px] text-[#8A7A6E] mt-0.5">Integration pending gateway approval.</div>
              </div>
            </div>
            <span className="text-[9px] uppercase font-bold bg-[#FAF6EC] border border-[#EADFC9] text-[#8A7A6E] px-2 py-0.5 rounded-full shrink-0">
              Coming Soon
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
