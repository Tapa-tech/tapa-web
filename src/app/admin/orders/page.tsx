"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ShoppingCart, RefreshCw } from "lucide-react";

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
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus: "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  deliveryAddress: string; 
  user: {
    name?: string;
    phone?: string;
    email?: string;
  };
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data || []);
      } else {
        throw new Error("Failed to fetch orders");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (
    orderId: string,
    field: "orderStatus" | "paymentStatus",
    value: string
  ) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          [field]: value,
        }),
      });

      if (res.ok) {
        
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, [field]: value } : o))
        );
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#C82A54] animate-spin" />
        <span className="text-[#8A7A6E] mt-3 font-semibold">Loading orders history...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F2ECE4] pb-4 select-none">
        <div>
          <div className="flex items-center gap-2 mb-1.5 text-[10px] text-[#8A7A6E] uppercase font-bold tracking-wider">
            <Link href="/admin" className="hover:underline">Dashboard</Link>
            <span>&gt;</span>
            <span className="text-[#6A5A4E]">Orders</span>
          </div>
          <h1 className="font-serif font-bold text-3xl text-[#3A332C]">
            Orders Management
          </h1>
          <p className="text-xs text-[#6A5A4E] mt-1">
            Browse placed orders, inspect snapshots, print checklists, and update fulfillment logistics.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="flex items-center gap-1.5 border border-border hover:bg-gray-50 text-dark font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-colors cursor-pointer select-none"
        >
          <RefreshCw size={12} />
          <span>Refresh List</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-xs font-semibold">
          ⚠️ {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center p-12 bg-[#FAF6EC] border border-[#EADFC9] rounded-2xl select-none">
          <ShoppingCart className="mx-auto text-sub-text animate-pulse mb-3" size={36} />
          <h3 className="font-serif font-bold text-lg text-[#3A332C]">No Orders Placed</h3>
          <p className="text-xs text-[#8A7A6E] mt-1">
            Once customers submit checkout details, orders will appear in this log list.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            
            let address: any = {};
            try {
              address = JSON.parse(order.deliveryAddress);
            } catch (e) {
              address = { name: "Error parsing address" };
            }

            return (
              <div
                key={order.id}
                className="bg-white border border-[#EADFC9] rounded-2xl p-5 md:p-6 shadow-sm space-y-4 relative"
              >
                {updatingId === order.id && (
                  <div className="absolute inset-0 bg-white/60 rounded-2xl flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 text-[#C82A54] animate-spin" />
                  </div>
                )}

                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#F2ECE4] pb-3 text-xs">
                  <div>
                    <span className="text-[#8A7A6E] font-bold uppercase tracking-wider">Order Number: </span>
                    <span className="font-bold text-dark font-mono text-sm">{order.orderNumber}</span>
                  </div>
                  <div className="text-[#8A7A6E]">
                    Placed At: <span className="font-bold text-dark">{new Date(order.createdAt).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-bold text-[#8A7A6E] uppercase tracking-wider mb-1">Customer Profile</h4>
                      <div className="font-semibold text-dark">{order.user?.name || address.name || "Guest user"}</div>
                      <div className="text-[#8A7A6E] mt-0.5">📞 {order.user?.phone || address.mobile || "No number linked"}</div>
                      {order.user?.email && <div className="text-[#8A7A6E] mt-0.5">✉️ {order.user.email}</div>}
                    </div>

                    <div>
                      <h4 className="font-bold text-[#8A7A6E] uppercase tracking-wider mb-1">Delivery Address</h4>
                      <div className="text-sub-text leading-relaxed">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                        <br />
                        {address.city}, {address.state} - <strong className="text-dark font-mono">{address.pincode}</strong>
                      </div>
                    </div>
                  </div>

                  
                  <div>
                    <h4 className="font-bold text-[#8A7A6E] uppercase tracking-wider mb-1">Items Snapshot Checklist</h4>
                    <div className="bg-[#FAF6EC]/40 border border-[#EADFC9]/60 rounded-xl p-3 space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-4">
                          <span className="text-sub-text font-medium leading-relaxed">
                            {item.productName} <strong className="text-dark shrink-0">x{item.quantity}</strong>
                          </span>
                          <span className="font-bold text-dark shrink-0">
                            ₹{(Number(item.priceAtOrder) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-[#EADFC9]/60 pt-2 flex justify-between font-bold text-sm">
                        <span className="text-dark">Fulfillment Total</span>
                        <span className="text-[#C82A54]">₹{Number(order.totalAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div className="border-t border-[#F2ECE4] pt-4 mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs select-none">
                  <div>
                    <span className="text-[#8A7A6E] font-bold uppercase tracking-wider">Payment Method: </span>
                    <span className="font-bold text-dark">{order.paymentMethod}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#8A7A6E]">Payment Status:</span>
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, "paymentStatus", e.target.value)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs font-bold text-[#3A332C] bg-white transition-colors"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </div>

                    
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#8A7A6E]">Order Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleUpdateStatus(order.id, "orderStatus", e.target.value)
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-[#DED6C9] focus:outline-none focus:border-[#C82A54] text-xs font-bold text-[#3A332C] bg-white transition-colors"
                      >
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
