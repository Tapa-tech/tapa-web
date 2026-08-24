"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, CreditCard, ShoppingBag, CheckCircle, Package, Truck, Smile } from "lucide-react";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import TopNav from "@/components/layout/TopNav";
import Footer from "@/components/layout/Footer";

interface OrderItem {
  id: string;
  productName: string;
  priceAtOrder: string;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED" | "PENDING_ON_DELIVERY";
  orderStatus: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  deliveryAddress: string; 
  items: OrderItem[];
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    async function loadOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        } else {
          triggerToast("Failed to load order details.");
          router.push("/account");
        }
      } catch (err) {
        console.error("Error loading order:", err);
        triggerToast("Failed to connect to the server.");
        router.push("/account");
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [params.id, router]);

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased flex flex-col justify-between">
        <div>
          <AnnouncementBar />
          <TopNav activeTab="" onTriggerToast={triggerToast} />
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#C82A54] border-t-transparent rounded-full animate-spin"></div>
            <span className="font-semibold text-sm">Loading order details...</span>
          </div>
        </div>
        <Footer onTriggerToast={triggerToast} />
      </div>
    );
  }

  
  let addressInfo = {
    name: "",
    mobile: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: ""
  };
  try {
    if (order.deliveryAddress.startsWith("{")) {
      addressInfo = JSON.parse(order.deliveryAddress);
    } else {
      addressInfo.addressLine1 = order.deliveryAddress;
    }
  } catch (e) {
    addressInfo.addressLine1 = order.deliveryAddress;
  }

  
  const itemsSubtotal = order.items.reduce((sum, item) => sum + Number(item.priceAtOrder) * item.quantity, 0);
  const shippingFee = itemsSubtotal >= 1500 ? 0 : 99;

  
  const steps = [
    { label: "Confirmed", status: "CONFIRMED", icon: CheckCircle },
    { label: "Processing", status: "PROCESSING", icon: Clock },
    { label: "Shipped", status: "SHIPPED", icon: Truck },
    { label: "Delivered", status: "DELIVERED", icon: Smile }
  ];

  const getStepIndex = (status: string) => {
    if (status === "CANCELLED") return -1;
    return steps.findIndex(s => s.status === status);
  };

  const currentStepIdx = getStepIndex(order.orderStatus);

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#2C2010] font-sans antialiased flex flex-col justify-between">
      <div>
        <AnnouncementBar />
        <TopNav activeTab="" onTriggerToast={triggerToast} />

        <main className="max-w-4xl mx-auto w-full px-4 py-8">
          
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C82A54] hover:text-[#B02047] transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Account</span>
          </Link>

          
          <div className="bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="text-[10px] uppercase font-bold text-[#C82A54] tracking-wider mb-1">
                Order Observation Profile
              </div>
              <h1 className="font-serif font-bold text-2xl text-[#3A332C]">
                Order {order.orderNumber}
              </h1>
              <p className="text-xs text-[#6A5A4E] mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")} at {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <div>
              {order.orderStatus === "CANCELLED" ? (
                <span className="text-[11px] font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">
                  ⚠️ Cancelled
                </span>
              ) : (
                <span className="text-[11px] font-bold uppercase tracking-wider text-pink bg-pink/5 border border-pink/20 px-3 py-1.5 rounded-full animate-pulse">
                  {order.orderStatus}
                </span>
              )}
            </div>
          </div>

          
          {order.orderStatus === "CANCELLED" ? (
            <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 shadow-sm mb-6 text-center">
              <span className="text-2xl block mb-1">🛑</span>
              <h3 className="font-serif font-bold text-[#3A332C] text-lg">This order has been cancelled</h3>
              <p className="text-xs text-sub-text mt-1 max-w-md mx-auto">
                The items are no longer scheduled for fulfillment. If you did not request this, please contact support.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm mb-6">
              <h3 className="font-serif font-bold text-[#3A332C] text-lg mb-6 flex items-center gap-2">
                <Package size={18} className="text-[#C82A54]" />
                <span>Tracking Timeline</span>
              </h3>
              
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                
                <div className="absolute left-[18px] top-[18px] bottom-[18px] w-0.5 md:left-4 md:right-4 md:top-4 md:h-0.5 md:w-auto bg-[#F2ECE4] z-0" />
                
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIdx;
                  const isActive = idx === currentStepIdx;
                  
                  return (
                    <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 z-10 md:w-1/4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted 
                          ? "bg-[#C82A54] border-[#C82A54] text-white shadow-sm" 
                          : "bg-white border-[#DED6C9] text-sub-text"
                      } ${isActive ? "scale-110 ring-4 ring-[#FFEAEF]" : ""}`}>
                        <Icon size={14} />
                      </div>
                      <div className="text-left md:text-center">
                        <div className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-[#C82A54]" : "text-sub-text"}`}>
                          {step.label}
                        </div>
                        {isActive && (
                          <div className="text-[9px] text-pink font-semibold mt-0.5">Active</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-6">
              
              <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-[#3A332C] text-lg mb-4 flex items-center gap-2 border-b border-[#F2ECE4] pb-2">
                  <MapPin size={18} className="text-[#C82A54]" />
                  <span>Delivery Address</span>
                </h3>
                <div className="text-xs space-y-1.5 leading-relaxed text-[#5C4D3C] font-medium">
                  {addressInfo.name && (
                    <div className="font-bold text-dark text-sm mb-1">{addressInfo.name}</div>
                  )}
                  {addressInfo.mobile && (
                    <div>📞 {addressInfo.mobile}</div>
                  )}
                  <div>{addressInfo.addressLine1}</div>
                  {addressInfo.addressLine2 && <div>{addressInfo.addressLine2}</div>}
                  {addressInfo.city && (
                    <div>{addressInfo.city}, {addressInfo.state} {addressInfo.pincode}</div>
                  )}
                </div>
              </div>

              
              <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif font-bold text-[#3A332C] text-lg mb-4 flex items-center gap-2 border-b border-[#F2ECE4] pb-2">
                  <CreditCard size={18} className="text-[#C82A54]" />
                  <span>Payment Information</span>
                </h3>
                <div className="text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8A7A6E] font-semibold">Payment Method:</span>
                    <span className="font-bold text-dark uppercase">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#8A7A6E] font-semibold">Payment Status:</span>
                    <span className="font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="space-y-6">
              
              <div className="bg-white border border-[#EADFC9] rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-serif font-bold text-[#3A332C] text-lg mb-4 flex items-center gap-2 border-b border-[#F2ECE4] pb-2">
                    <ShoppingBag size={18} className="text-[#C82A54]" />
                    <span>Order items</span>
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="text-xs flex justify-between items-start gap-4">
                        <div>
                          <div className="font-semibold text-dark leading-tight">{item.productName}</div>
                          <div className="text-[10px] text-sub-text mt-0.5">Qty: {item.quantity} · ₹{Number(item.priceAtOrder).toLocaleString()} ea</div>
                        </div>
                        <span className="font-bold text-dark shrink-0">
                          ₹{(Number(item.priceAtOrder) * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#F2ECE4] pt-4 text-xs space-y-2.5">
                  <div className="flex justify-between items-center text-sub-text">
                    <span>Items Subtotal</span>
                    <span className="font-medium text-dark">₹{itemsSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sub-text">
                    <span>Shipping Charges</span>
                    <span className="font-medium text-dark">
                      {shippingFee === 0 ? "FREE" : `₹${shippingFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="border-t border-[#F2ECE4] pt-2.5 flex justify-between items-center font-bold text-dark text-sm">
                    <span>Grand Total</span>
                    <span className="text-[#C82A54] font-serif font-bold text-base">₹{Number(order.totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer onTriggerToast={triggerToast} />

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-dark text-white border border-white/10 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce font-sans text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-pink animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
