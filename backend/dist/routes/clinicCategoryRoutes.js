"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clinicCategory_1 = __importDefault(require("../models/clinicCategory"));
const router = express_1.default.Router();
// Create new category
router.post("/", async (req, res) => {
    try {
        const { categoryId, name, imageUrl } = req.body;
        if (!categoryId || !name || !imageUrl) {
            return res.status(400).json({ message: "Category ID, Name and Image are required" });
        }
        const existing = await clinicCategory_1.default.findOne({ categoryId });
        if (existing) {
            return res.status(400).json({ message: "Category ID must be unique" });
        }
        const category = new clinicCategory_1.default({ categoryId, name, imageUrl });
        await category.save();
        res.status(201).json(category);
    }
    catch (error) {
        console.error("Error creating clinic category:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// Get all categories
router.get("/", async (_req, res) => {
    try {
        const categories = await clinicCategory_1.default.find().sort({ createdAt: -1 });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// Update category
router.put("/:id", async (req, res) => {
    try {
        const { categoryId, name, imageUrl } = req.body;
        if (!categoryId || !name || !imageUrl) {
            return res.status(400).json({ message: "Category ID, Name, and Image are required" });
        }
        // Ensure categoryId stays unique (ignore current doc)
        const existing = await clinicCategory_1.default.findOne({ categoryId, _id: { $ne: req.params.id } });
        if (existing) {
            return res.status(400).json({ message: "Category ID must be unique" });
        }
        const updated = await clinicCategory_1.default.findByIdAndUpdate(req.params.id, { categoryId, name, imageUrl }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(updated);
    }
    catch (error) {
        console.error("Error updating clinic category:", error);
        res.status(500).json({ message: "Server error" });
    }
});
// Delete category
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await clinicCategory_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting clinic category:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
