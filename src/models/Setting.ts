import mongoose from "mongoose";

export interface ISetting {
  _id: string;
  key: string;
  value: any;
}

const SettingSchema = new mongoose.Schema<ISetting>({
  key: { type: String, unique: true, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

export const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
