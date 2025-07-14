import { Schema, model, Document } from "mongoose";

interface IClick {
  timestamp: Date;
  ip: string;
  userAgent: string;
  referrer: string;
  location: object;
}

export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date;
  clickCount: number;
  clicks: IClick[];
}

const urlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  clickCount: { type: Number, default: 0 },
  clicks: [
    {
      timestamp: { type: Date, default: Date.now },
      ip: { type: String },
      userAgent: { type: String },
      referrer: { type: String },
      location: { type: Object },
    },
  ],
});

export const Url = model<IUrl>("Url", urlSchema);
