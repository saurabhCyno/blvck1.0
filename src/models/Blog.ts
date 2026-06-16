import mongoose from "mongoose";

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  createdAt: Date;
}

const BlogSchema = new mongoose.Schema<IBlog>({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
