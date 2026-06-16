"use client";

import { useState } from "react";
import { adminUpdateOrderStatus } from "@/app/actions";
import { Calendar, User, Phone, MapPin, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrdersClientProps {
  initialOrders: any[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    try {
      const response = await adminUpdateOrderStatus(orderId, nextStatus);
      if (response.success) {
        setOrders(
          orders.map((o) => (o._id === orderId ? { ...o, orderStatus: nextStatus } : o))
        );
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch {
      alert("Server error.");
    }
  };

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const filteredOrders = orders.filter(
    (o) => filterStatus === "All" || o.orderStatus === filterStatus
  );

  const statuses = ["Pending", "In Progress", "Completed", "Cancelled"];

  const getStatusStyle = (status: string) => {
    switch (status) {
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
    <div className="space-y-10 font-body">
      {/* Workspace Header */}
      <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black tracking-widest text-white uppercase">
            ORDER PIPELINE MANAGER
          </h1>
          <p className="text-white/45 text-xs mt-1">
            Track customer orders and update dispatch fulfillment states.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center space-x-2">
          <label htmlFor="pipeline-filter" className="text-xs font-display tracking-widest text-white/50 uppercase">
            FILTER STATE
          </label>
          <select
            id="pipeline-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-hidden"
          >
            <option value="All">ALL STATUSES</option>
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Directory Table */}
      <div className="bg-black border border-white/10 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <p className="text-xs text-white/45 py-12 text-center">No client orders match this state.</p>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              
              return (
                <div key={order._id} className="transition-all duration-300">
                  {/* Row Header Summarized Info */}
                  <div
                    onClick={() => toggleExpandOrder(order._id)}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 cursor-pointer hover:bg-white/5"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs text-white font-bold uppercase">
                          REF-{order._id.substring(order._id.length - 8)}
                        </span>
                        <span className={`border text-xs font-display font-black tracking-widest px-2 py-0.5 ${getStatusStyle(order.orderStatus)}`}>
                          {order.orderStatus.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">
                        {order.customerInfo.name} &bull; {order.items.reduce((s: number, i: any) => s + i.quantity, 0)} Items
                      </p>
                    </div>

                    <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-mono text-sm font-bold text-white">
                        ₹{order.totalAmount.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-white/40" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-white/40" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="bg-card-light/40 border-t border-white/5 p-6 grid grid-cols-1 md:grid-cols-12 gap-8 animate-fadeIn">
                      {/* Customer Details Column */}
                      <div className="md:col-span-4 space-y-4">
                        <h4 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
                          CLIENT PROFILE
                        </h4>
                        <div className="space-y-3 text-xs text-white/60">
                          <div className="flex items-center space-x-2">
                            <User className="h-3.5 w-3.5 text-white/30" />
                            <span className="text-white">{order.customerInfo.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3.5 w-3.5 text-white/30" />
                            <span>{order.customerInfo.phone}</span>
                          </div>
                          <div className="flex items-start space-x-2">
                            <MapPin className="h-3.5 w-3.5 text-white/30 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{order.customerInfo.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3.5 w-3.5 text-white/30" />
                            <span>
                              {new Date(order.createdAt).toLocaleString("en-US", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items Ordered List Column */}
                      <div className="md:col-span-5 space-y-4">
                        <h4 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
                          ITEMS SPECIFICATIONS
                        </h4>
                        <div className="space-y-3 text-xs">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0 last:pb-0">
                              <div>
                                <h5 className="font-display text-white tracking-widest uppercase">
                                  {item.productId?.title || "DELETED PRODUCT"}
                                </h5>
                                <p className="text-xs text-white/40 uppercase">
                                  SIZE: {item.size} &bull; QTY: {item.quantity}
                                </p>
                              </div>
                              <span className="font-mono text-white/60">
                                ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pipeline Status Updates Action Column */}
                      <div className="md:col-span-3 space-y-4">
                        <h4 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
                          UPDATE STATE
                        </h4>
                        <div className="space-y-2">
                          <label htmlFor={`order-status-${order._id}`} className="block text-xs font-display tracking-widest text-white/50">
                            PIPELINE STAGE
                          </label>
                          <select
                            id={`order-status-${order._id}`}
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden"
                          >
                            {statuses.map((s) => (
                              <option key={s} value={s}>
                                {s.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="bg-white/5 border border-white/10 p-3 text-xs text-white/50 leading-relaxed font-body">
                          Adjust state steps. Completed orders accumulate revenue totals.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
