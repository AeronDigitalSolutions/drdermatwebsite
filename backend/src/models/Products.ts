// src/models/Product.ts
import mongoose, { Schema, model, models, HydratedDocument } from "mongoose";
import { v4 as uuidv4 } from "uuid";

/** Plain interfaces describing shapes (not Mongoose Document variants) */
export interface IReview {
  rating: number;
  comment: string;
  user: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProduct {
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
  createdAt?: Date;
  updatedAt?: Date;
}

/** Mongoose Document type for this model */
export type ProductDocument = HydratedDocument<IProduct>;

const ReviewSchema = new Schema<IReview>(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
  },
  { _id: false } // store review as sub-doc with no separate _id
);

const ProductSchema = new Schema<ProductDocument>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
      default: () => `PROD-${uuidv4().slice(0, 8)}`,
    },
    category: { type: String, required: true },
    company: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    reviews: { type: [ReviewSchema], default: [] },
  },
  { timestamps: true }
);

/** Prevent model overwrite in dev/Next.js hot reload */
const ProductModel = (models.Product as mongoose.Model<ProductDocument>) || model<ProductDocument>("Product", ProductSchema);

export default ProductModel;