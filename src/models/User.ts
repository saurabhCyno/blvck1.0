import mongoose from "mongoose";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

if (mongoose.models && mongoose.models.User) {
  delete (mongoose.models as any).User;
}
export const User = mongoose.model("User", UserSchema);
