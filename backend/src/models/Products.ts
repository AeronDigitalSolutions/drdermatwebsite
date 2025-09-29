import mongoose, { Schema, Document } from "mongoose";
import * as uuid from "uuid";

export interface IReview {
  rating: number;
  comment: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  id: string;
  category: string;
  company: string;
  name: string;
  quantity: number;
  price: number;
  discountPrice: number;
  description: string;
  images: string[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
      default: () => `PROD-${uuid.v4().slice(0, 8)}`,
    },
    category: { type: String, required: true },
    company: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    reviews: { type: [ReviewSchema], default: [] }, // ✅ reviews
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
