"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const order_1 = __importDefault(require("../models/order"));
const userinformation_1 = __importDefault(require("../models/userinformation"));
const services_1 = __importDefault(require("../models/services")); // ✔ CORRECT FILE NAME
const clinic_1 = __importDefault(require("../models/clinic"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        // 📌 ADD HERE — log full request body
        console.log("🟢 Incoming Order Request:", req.body);
        const { userId, products, totalAmount, address } = req.body;
        if (!userId || !products || !totalAmount || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid userId" });
        }
        const user = await userinformation_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const order = new order_1.default({
            userId,
            products,
            totalAmount,
            address,
            paymentStatus: "success",
        });
        const savedOrder = await order.save();
        // 📌 ADD HERE — log saved order ID
        console.log("💾 Order saved:", savedOrder._id);
        /** ⭐ Store purchased services in the clinic */
        for (const item of products) {
            // 📌 ADD HERE — log each product being processed
            console.log("➡ Processing Product:", item);
            if (!item.id) {
                console.log("❌ ERROR: item.id is missing");
                continue;
            }
            const service = await services_1.default.findById(item.id);
            // 📌 ADD HERE — log what service was found
            console.log("🔍 SERVICE FOUND:", service);
            if (!service) {
                console.log("❌ ERROR: No service found for ID:", item.id);
                continue;
            }
            if (!service.clinic) {
                console.log("❌ ERROR: service.clinic missing for service:", service._id);
                continue;
            }
            const updatedClinic = await clinic_1.default.findByIdAndUpdate(service.clinic, {
                $push: {
                    purchasedServices: {
                        serviceId: service._id,
                        userId,
                        quantity: item.quantity,
                        totalPrice: item.price * item.quantity,
                    },
                },
            }, { new: true });
            // 📌 ADD HERE — log whether clinic was updated
            console.log("✅ Clinic updated:", (updatedClinic === null || updatedClinic === void 0 ? void 0 : updatedClinic._id) || "NOT UPDATED");
        }
        res.status(201).json(savedOrder);
    }
    catch (err) {
        // 📌 ADD HERE — log the actual error that caused 500
        console.log("❌ SERVER ERROR:", err);
        res.status(500).json({
            message: "Failed to create order",
            error: err.message,
        });
    }
});
exports.default = router;
