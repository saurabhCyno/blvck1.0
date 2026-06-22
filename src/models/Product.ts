import mongoose from "mongoose";

export interface IProduct {
  _id: string;
  title: string;
  description: string;
  originalPrice: number;
  sellingPrice: number;
  sizes: {
    size: "S" | "M" | "L" | "XL" | "XXL";
    stock: number;
  }[];
  gender: "Men" | "Women" | "Unisex";
  category: mongoose.Types.ObjectId | string;
  images: string[];
  imageFileIds: string[];
  specs: {
    brand: string;
    type: string;
    sleeve: string;
    fit: string;
    fabric: string;
    pattern: string;
  };
  isBestseller: boolean;
  createdAt: Date;
}

const ProductSchema = new mongoose.Schema<IProduct>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  originalPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  sizes: [{
    size: { type: String, enum: ["S", "M", "L", "XL", "XXL"], required: true },
    stock: { type: Number, default: 0 }
  }],
  gender: { type: String, enum: ["Men", "White", "Women", "Unisex"], required: true }, // Mapped enum Men/Women/Unisex but let's stick to 'Men', 'Women', 'Unisex'
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: [{ type: String }],
  imageFileIds: [{ type: String }],
  specs: {
    brand: { type: String, default: "PREMIUM BLVCK CORE LABELS" },
    type: { type: String, required: true },
    sleeve: { type: String, required: true },
    fit: { type: String, required: true },
    fabric: { type: String, required: true },
    pattern: { type: String, required: true }
  },
  isBestseller: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Clean up gender enum to be exact: Men, Women, Unisex
ProductSchema.path("gender").set((val: string) => {
  if (val === "Men" || val === "Women" || val === "Unisex") return val;
  return "Unisex";
});

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
