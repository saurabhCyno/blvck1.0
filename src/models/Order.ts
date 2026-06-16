import mongoose from "mongoose";

export interface IOrder {
  _id: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    productId: mongoose.Types.ObjectId | string | any;
    size: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
  paymentMethod: string;
  orderStatus: "Pending" | "In Progress" | "Completed" | "Cancelled" | "Delivered";
  totalAmount: number;
  createdAt: Date;
}

const OrderSchema = new mongoose.Schema<IOrder>({
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true }
  }],
  paymentMethod: { type: String, default: "COD" },
  orderStatus: { type: String, enum: ["Pending", "In Progress", "Completed", "Cancelled", "Delivered"], default: "Pending" },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
