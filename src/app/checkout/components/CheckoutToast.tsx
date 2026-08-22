import React from "react";

interface CheckoutToastProps {
  message: string | null;
}

export function CheckoutToast({ message }: CheckoutToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs select-none">
      <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
      <span>{message}</span>
    </div>
  );
}
