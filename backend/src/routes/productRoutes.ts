import express, { Request, Response } from "express";
import Product from "../models/Products";

const router = express.Router();

// CREATE PRODUCT
router.post("/", async (req: Request, res: Response) => {
  try {
    const { category, company, name, quantity, price, discountPrice, description, images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const newProduct = new Product({
      category,
      company,
      name,
      quantity,
      price,
      discountPrice,
      description,
      images,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err: any) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Failed to create product.", error: err });
  }
});

// READ ALL PRODUCTS
router.get("/", async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const filter: any = {};

    if (categoryId && categoryId !== "all") {
      filter.category = categoryId;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ message: "Failed to fetch products.", error: err });
  }
});

// READ ONE PRODUCT BY custom `id`
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product.", error: err });
  }
});

// UPDATE PRODUCT BY custom `id`
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const updated = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product.", error: err });
  }
});

// DELETE PRODUCT BY custom `id`
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleted = await Product.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product.", error: err });
  }
});

// ADD REVIEW TO PRODUCT
router.post("/:id/reviews", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, user } = req.body;

    const product = await Product.findOne({ id });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = {
      rating,
      comment,
      user: user || "Anonymous",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    product.reviews.push(newReview);
    await product.save();

    res.status(201).json(product.reviews); // return updated reviews
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Failed to add review.", error: err });
  }
});

export default router;
