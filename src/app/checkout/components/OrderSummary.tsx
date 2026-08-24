import React from "react";
import { ShieldCheck } from "lucide-react";
import { CartItemState } from "@/lib/store/cartStore";

interface OrderSummaryProps {
  items: CartItemState[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryFee,
  totalAmount,
}: OrderSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm">
      <h2 className="font-serif font-bold text-lg text-dark border-b border-border pb-3">Items Summary</h2>

      
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between items-start gap-4 text-xs">
            <div className="flex gap-2">
              <span className="font-bold text-dark shrink-0">x{item.quantity}</span>
              <span className="text-sub-text">{item.name}</span>
            </div>
            <span className="font-bold text-dark shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      
      <div className="border-t border-border pt-3 space-y-2.5 text-xs">
        <div className="flex justify-between">
          <span className="text-sub-text">Subtotal</span>
          <span className="font-bold text-dark">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sub-text">Delivery Fee</span>
          <span className="font-bold text-dark">
            {deliveryFee === 0 ? (
              <span className="text-green-600 font-bold uppercase text-[10px]">Free</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>
        <div className="border-t border-border pt-3 mt-3 flex justify-between text-sm">
          <span className="font-bold text-dark">Total Amount</span>
          <span className="font-bold text-base text-[#C82A54]">₹{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      
      <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-xl p-3 flex items-start gap-2.5 text-[10px] text-[#6A5A4E] leading-relaxed">
        <ShieldCheck size={16} className="text-[#C82A54] shrink-0 mt-0.5" />
        <span>We package each kit in a clean environment, maintaining pure ritual integrity. Return request accepted within 24 hours of delivery.</span>
      </div>
    </div>
  );
}
