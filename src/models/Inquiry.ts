import mongoose from "mongoose";

export interface IInquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "Unread" | "Read";
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema<IInquiry>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["Unread", "Read"], default: "Unread" },
  createdAt: { type: Date, default: Date.now }
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);
