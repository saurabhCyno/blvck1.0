"use client";

import { useState } from "react";
import { userLogout, updateUserProfile } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Phone, Mail, Package, ChevronDown, ChevronUp } from "lucide-react";

interface AccountClientProps {
  user: { id: string; name: string; email: string; phone: string };
  initialOrders: any[];
}

export default function AccountClient({ user: initialUser, initialOrders }: AccountClientProps) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [orders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, phone: user.phone });
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await userLogout();
    router.push("/");
    router.refresh();
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await updateUserProfile(form);
      if (res.success) {
        setUser({ ...user, name: form.name, phone: form.phone });
        setEditing(false);
      } else {
        alert("Failed to update profile.");
      }
    } catch {
      alert("Server error.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
      case "Completed":
        return "border-green-500/20 bg-green-500/5 text-green-400";
      case "In Progress":
        return "border-blue-500/20 bg-blue-500/5 text-blue-400";
      case "Cancelled":
        return "border-red-500/20 bg-red-500/5 text-red-400";
      default:
        return "border-amber-500/20 bg-amber-500/5 text-amber-400";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-black tracking-widest text-white">
            BLVCK CORE
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/shop" className="text-xs text-white/50 hover:text-white transition-colors tracking-widest uppercase font-display">
              Shop
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 text-xs text-white/50 hover:text-white transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Profile Section */}
        <div className="border border-white/10 p-6 space-y-5">
          <h2 className="font-display text-lg font-black tracking-widest text-white uppercase">Account</h2>

          {editing ? (
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                />
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="border border-white/20 bg-white/5 px-4 py-2 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone }); }}
                  className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-white/70 max-w-md">
              <div className="flex items-center space-x-2">
                <User className="h-3.5 w-3.5 text-white/30" />
                <span>{user.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-white/30" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-white/30" />
                <span>{user.phone}</span>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest mt-2 inline-block"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-black tracking-widest text-white uppercase flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Order History</span>
          </h2>

          {orders.length === 0 ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-xs text-white/40">No orders yet.</p>
              <Link
                href="/shop"
                className="inline-block mt-4 border border-white/20 px-6 py-2 text-xs text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-display font-black"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="bg-black border border-white/10 divide-y divide-white/10">
              {orders.map((order: any) => (
                <div key={order._id}>
                  <div
                    onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-white font-bold uppercase">
                          REF-{order._id.substring(order._id.length - 8)}
                        </span>
                        <span className={`border text-[10px] font-display font-black tracking-widest px-2 py-0.5 ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })} &bull; {order.items.reduce((s: number, i: any) => s + i.quantity, 0)} items
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-white">₹{order.totalAmount.toFixed(2)}</span>
                      {expandedOrderId === order._id ? (
                        <ChevronUp className="h-4 w-4 text-white/40" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-white/40" />
                      )}
                    </div>
                  </div>

                  {expandedOrderId === order._id && (
                    <div className="bg-white/[0.02] border-t border-white/5 p-4 space-y-3">
                      <div className="text-[10px] text-white/40">
                        <p>Shipping: {order.customerInfo.address}</p>
                        <p>Payment: {order.paymentMethod}</p>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <div>
                              <p className="text-white tracking-widest uppercase font-display">
                                {item.productId?.title || "Product"}
                              </p>
                              <p className="text-[10px] text-white/40">Size: {item.size} &bull; Qty: {item.quantity}</p>
                            </div>
                            <span className="font-mono text-white/60">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
