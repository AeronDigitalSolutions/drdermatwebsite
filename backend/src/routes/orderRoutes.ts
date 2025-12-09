import express from "express";
import mongoose from "mongoose";
import Order from "../models/order";
import UserProfile from "../models/userinformation";
import Service from "../models/services";   // ✔ CORRECT FILE NAME
import Clinic from "../models/clinic";

const router = express.Router();
router.post("/", async (req, res) => {
  try {
    // 📌 ADD HERE — log full request body
    console.log("🟢 Incoming Order Request:", req.body);

    const { userId, products, totalAmount, address } = req.body;

    if (!userId || !products || !totalAmount || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await UserProfile.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = new Order({
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

      const service = await Service.findById(item.id);

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

      const updatedClinic = await Clinic.findByIdAndUpdate(
        service.clinic,
        {
          $push: {
            purchasedServices: {
              serviceId: service._id,
              userId,
              quantity: item.quantity,
              totalPrice: item.price * item.quantity,
            },
          },
        },
        { new: true }
      );

      // 📌 ADD HERE — log whether clinic was updated
      console.log("✅ Clinic updated:", updatedClinic?._id || "NOT UPDATED");
    }

    res.status(201).json(savedOrder);
  } catch (err: any) {
    // 📌 ADD HERE — log the actual error that caused 500
    console.log("❌ SERVER ERROR:", err);

    res.status(500).json({
      message: "Failed to create order",
      error: err.message,
    });
  }
});

export default router;
