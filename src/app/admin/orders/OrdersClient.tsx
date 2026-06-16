"use client";

import { useState, useCallback } from "react";
import { adminUpdateOrderStatus, adminCreateOrder, adminGetOrders } from "@/app/actions";
import { Calendar, User, Phone, MapPin, ChevronDown, ChevronUp, Plus, X, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface OrdersClientProps {
  initialOrders: any[];
  products: any[];
  categories: any[];
}

interface FormItem {
  productId: string;
  size: string;
  quantity: number;
  priceAtPurchase: number;
  title: string;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

export default function OrdersClient({ initialOrders, products, categories }: OrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customer, setCustomer] = useState(emptyForm);
  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [creating, setCreating] = useState(false);

  const selectedProduct = products.find((p: any) => p._id === selectedProductId);

  const resetForm = useCallback(() => {
    setCustomer(emptyForm);
    setFormItems([]);
    setSelectedProductId("");
    setSelectedSize("");
    setSelectedQty(1);
    setPaymentMethod("COD");
  }, []);

  const addItem = () => {
    if (!selectedProductId || !selectedSize || selectedQty < 1) return;
    const sizeData = selectedProduct?.sizes?.find((s: any) => s.size === selectedSize);
    if (!sizeData) return;
    setFormItems((prev) => [
      ...prev,
      {
        productId: selectedProductId,
        size: selectedSize,
        quantity: selectedQty,
        priceAtPurchase: selectedProduct.sellingPrice,
        title: selectedProduct.title,
      },
    ]);
    setSelectedSize("");
    setSelectedQty(1);
  };

  const removeItem = (index: number) => {
    setFormItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = formItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address || formItems.length === 0) {
      alert("Please fill in customer details and add at least one item.");
      return;
    }
    setCreating(true);
    try {
      const res = await adminCreateOrder({
        customerInfo: {
          name: customer.name,
          email: customer.email || `${customer.phone}@whatsapp.local`,
          phone: customer.phone,
          address: customer.address,
        },
        items: formItems.map(({ productId, size, quantity, priceAtPurchase }) => ({
          productId,
          size,
          quantity,
          priceAtPurchase,
        })),
        totalAmount,
        paymentMethod,
      });
      if (res.success) {
        setShowCreateModal(false);
        resetForm();
        const freshOrders = await adminGetOrders();
        setOrders(freshOrders);
      } else {
        alert(res.error || "Failed to create order.");
      }
    } catch {
      alert("Server error.");
    } finally {
      setCreating(false);
    }
  };

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

  const statuses = ["Pending", "In Progress", "Completed", "Delivered", "Cancelled"];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return "border-green-500/20 bg-green-500/5 text-green-400";
      case "In Progress":
        return "border-blue-500/20 bg-blue-500/5 text-blue-400";
      case "Delivered":
        return "border-emerald-500/20 bg-emerald-500/5 text-emerald-400";
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

        {/* Create WhatsApp Order Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 border border-white/20 px-4 py-1.5 text-xs text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-display font-black"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>WhatsApp Order</span>
        </button>
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

      {/* Create WhatsApp Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="font-display text-lg font-black tracking-widest text-white uppercase">Create WhatsApp Order</h2>
                <p className="text-white/45 text-xs mt-1">Manually record an order received via WhatsApp</p>
              </div>
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Customer Details */}
              <div className="space-y-4">
                <h3 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Full Name *</label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Email</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Phone *</label>
                    <input
                      type="text"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden"
                    >
                      <option value="COD">COD</option>
                      <option value="Online">Online Transfer</option>
                      <option value="Paid">Already Paid</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Shipping Address *</label>
                  <textarea
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden focus:border-white/30 resize-none"
                    rows={2}
                    placeholder="Street, City, State, Pincode"
                  />
                </div>
              </div>

              {/* Add Items */}
              <div className="space-y-4">
                <h3 className="font-display text-xs text-white tracking-widest font-black uppercase border-b border-white/5 pb-2">
                  Add Items
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Product</label>
                    <select
                      value={selectedProductId}
                      onChange={(e) => { setSelectedProductId(e.target.value); setSelectedSize(""); }}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden"
                    >
                      <option value="">Select Product</option>
                      {categories.map((cat: any) => (
                        <optgroup key={cat._id} label={cat.name.toUpperCase()}>
                          {products
                            .filter((p: any) => (p.category?._id || p.category) === cat._id)
                            .map((p: any) => (
                              <option key={p._id} value={p._id}>
                                {p.title} - ₹{p.sellingPrice}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Size</label>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      disabled={!selectedProduct}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden disabled:opacity-30"
                    >
                      <option value="">Select Size</option>
                      {selectedProduct?.sizes
                        ?.filter((s: any) => s.stock > 0)
                        .map((s: any) => (
                          <option key={s.size} value={s.size}>
                            {s.size} (Stock: {s.stock})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-display tracking-widest text-white/50 uppercase">Qty</label>
                    <input
                      type="number"
                      min={1}
                      max={selectedProduct?.sizes?.find((s: any) => s.size === selectedSize)?.stock || 1}
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(parseInt(e.target.value) || 1)}
                      disabled={!selectedSize}
                      className="w-full bg-black border border-white/10 px-3 py-2 text-xs text-white focus:outline-hidden disabled:opacity-30"
                    />
                  </div>
                  <div className="md:col-span-2 flex items-end">
                    <button
                      onClick={addItem}
                      disabled={!selectedProductId || !selectedSize || selectedQty < 1}
                      className="w-full border border-white/20 px-3 py-2 text-xs text-white hover:bg-white/5 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {formItems.length > 0 && (
                  <div className="bg-black border border-white/10 divide-y divide-white/5">
                    {formItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white font-display tracking-widest uppercase truncate">{item.title}</p>
                          <p className="text-[10px] text-white/40 mt-0.5">
                            Size: {item.size} &bull; Qty: {item.quantity} &bull; ₹{item.priceAtPurchase.toFixed(2)} ea
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          <span className="font-mono text-xs text-white">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</span>
                          <button onClick={() => removeItem(idx)} className="text-red-400/60 hover:text-red-400 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total */}
                {formItems.length > 0 && (
                  <div className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10">
                    <span className="text-xs font-display tracking-widest text-white/50 uppercase">Total Amount</span>
                    <span className="font-mono text-base font-bold text-white">₹{totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-white/10">
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="border border-white/10 px-6 py-2 text-xs text-white/60 hover:text-white transition-colors uppercase tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={creating || !customer.name || !customer.phone || !customer.address || formItems.length === 0}
                className="border border-white/20 bg-white/5 px-6 py-2 text-xs text-white hover:bg-white/10 transition-colors uppercase tracking-widest font-display font-black disabled:opacity-30"
              >
                {creating ? "Creating..." : "Create Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
