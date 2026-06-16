import mongoose from "mongoose";

export interface ICategory {
  _id: string;
  name: string;
}

const CategorySchema = new mongoose.Schema<ICategory>({
  name: { type: String, required: true, unique: true },
});

export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
