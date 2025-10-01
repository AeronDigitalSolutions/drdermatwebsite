"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
/** Subdocument schema for reviews */
const ReviewSchema = new mongoose_1.Schema({
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: String, required: true },
    createdAt: { type: Date, default: () => new Date() },
    updatedAt: { type: Date, default: () => new Date() },
}, { _id: false });
/** Main product schema */
const ProductSchema = new mongoose_1.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
        default: () => `PROD-${(0, uuid_1.v4)().slice(0, 8)}`,
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
}, { timestamps: true });
/** Prevent model overwrite in dev/hot reload */
const ProductModel = mongoose_1.models.Product ||
    (0, mongoose_1.model)("Product", ProductSchema);
exports.default = ProductModel;
