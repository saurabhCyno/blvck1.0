import mongoose from "mongoose";

export interface IReview {
  _id: string;
  productId: mongoose.Types.ObjectId | string;
  userId: mongoose.Types.ObjectId | string;
  userName: string;
  rating: number;
  comment: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: Date;
}

const ReviewSchema = new mongoose.Schema<IReview>({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);
