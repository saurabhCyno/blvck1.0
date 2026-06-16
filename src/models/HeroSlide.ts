import mongoose from "mongoose";

export interface IHeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
  imageFileId?: string;
  order: number;
  createdAt: Date;
}

const HeroSlideSchema = new mongoose.Schema<IHeroSlide>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  description: { type: String, required: true },
  buttonText: { type: String, required: true },
  href: { type: String, required: true },
  image: { type: String, required: true },
  imageFileId: { type: String },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const HeroSlide =
  mongoose.models.HeroSlide || mongoose.model("HeroSlide", HeroSlideSchema);
