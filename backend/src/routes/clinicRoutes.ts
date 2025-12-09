// routes/clinics.ts
import express, { Request, Response } from "express";
import Clinic from "../models/clinic";
import ClinicCategory from "../models/clinicCategory";
import jwt from "jsonwebtoken";

const router = express.Router();

/* --------------------------------------
   CREATE CLINIC
----------------------------------------- */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      mobile,
      whatsapp,
      mapLink,
      address,
      verified,
      trusted,
      images,
      email,
      password,
      category,
    } = req.body;

    if (!images || !images.length) {
      return res.status(400).json({ message: "At least one image is required." });
    }
    if (!email || !password) {
      return res.status(400).json({ message: "Email & password are required." });
    }
    if (!category) {
      return res.status(400).json({ message: "Clinic category is required." });
    }

    const categoryExists = await ClinicCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid clinic category." });
    }

    const clinicExists = await Clinic.findOne({ email });
    if (clinicExists) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newClinic = new Clinic({
      name,
      mobile,
      whatsapp,
      mapLink,
      address,
      verified,
      trusted,
      images,
      email,
      password,
      category,
    });

    await newClinic.save();
    res.status(201).json({ message: "Clinic created successfully", clinic: newClinic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create clinic.", error: err });
  }
});

/* --------------------------------------
   CLINIC LOGIN
----------------------------------------- */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password are required." });
    }

    const clinic = await Clinic.findOne({ email });
    if (!clinic) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await clinic.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: clinic._id, role: "clinic" },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Clinic login successful",
      token,
      clinic: { id: clinic._id, name: clinic.name, email: clinic.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err });
  }
});

/* --------------------------------------
   GET ALL CLINICS
----------------------------------------- */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const clinics = await Clinic.find()
      .select("-password")
      .populate("category", "name");

    res.status(200).json(clinics);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch clinics.", error: err });
  }
});

/* --------------------------------------
   GET SINGLE CLINIC
----------------------------------------- */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const clinic = await Clinic.findById(req.params.id)
      .select("-password")
      .populate("category", "name");

    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    res.status(200).json(clinic);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch clinic.", error: err });
  }
});

/* --------------------------------------
   UPDATE CLINIC
----------------------------------------- */
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const {
      name,
      mobile,
      whatsapp,
      mapLink,
      address,
      verified,
      trusted,
      images,
      category,
    } = req.body;

    if (category) {
      const categoryExists = await ClinicCategory.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid clinic category." });
      }
    }

    const updatedClinic = await Clinic.findByIdAndUpdate(
      req.params.id,
      { name, mobile, whatsapp, mapLink, address, verified, trusted, images, category },
      { new: true }
    )
      .select("-password")
      .populate("category", "name");

    if (!updatedClinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json(updatedClinic);
  } catch (err) {
    console.error("Update clinic error:", err);
    res.status(500).json({ message: "Failed to update clinic.", error: err });
  }
});

/* --------------------------------------
   DELETE CLINIC
----------------------------------------- */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deletedClinic = await Clinic.findByIdAndDelete(req.params.id);

    if (!deletedClinic) return res.status(404).json({ message: "Clinic not found" });

    res.status(200).json({ message: "Clinic deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete clinic.", error: err });
  }
});

/* --------------------------------------
   GET PURCHASED SERVICES (UPDATED)
----------------------------------------- */
router.get("/:id/purchased-services", async (req, res) => {
  try {
    const clinic = await Clinic.findById(req.params.id)
      .populate("purchasedServices.serviceId", "serviceName price images")
      .populate("purchasedServices.userId", "name email")
      .populate(
        "purchasedServices.assignedDoctor",
        "title firstName lastName specialist"
      ); // ⭐ NEW

    if (!clinic) return res.status(404).json({ message: "Clinic not found" });

    res.json(clinic.purchasedServices || []);
  } catch (err) {
    console.error("❌ Error fetching purchased services:", err);
    res.status(500).json({ message: "Failed to fetch purchased services" });
  }
});

/* --------------------------------------
   ASSIGN DOCTOR TO PURCHASED SERVICE (UPDATED)
----------------------------------------- */
router.put(
  "/purchased-services/:serviceEntryId/assign-doctor",
  async (req, res) => {
    try {
      const { doctorId } = req.body;

      if (!doctorId)
        return res.status(400).json({ message: "Doctor ID is required" });

      const clinic = await Clinic.findOne({
        "purchasedServices._id": req.params.serviceEntryId,
      });

      if (!clinic)
        return res.status(404).json({ message: "Purchased service not found" });

      const serviceEntry = clinic.purchasedServices.id(req.params.serviceEntryId);
      serviceEntry.assignedDoctor = doctorId;

      await clinic.save();

      const refreshed = await Clinic.findById(clinic._id)
        .populate("purchasedServices.serviceId", "serviceName")
        .populate("purchasedServices.userId", "name")
        .populate(
          "purchasedServices.assignedDoctor",
          "title firstName lastName specialist"
        );

      const updatedEntry = refreshed!.purchasedServices.id(req.params.serviceEntryId);

      res.json({
        message: "Doctor assigned successfully",
        updatedEntry,
      });
    } catch (error) {
      console.error("❌ Assign doctor error:", error);
      res.status(500).json({ message: "Failed to assign doctor", error });
    }
  }
);
// ⭐ GET assigned services for a doctor
router.get("/doctor/:doctorId/assigned-services", async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    // Find all clinics that have assigned services
    const clinics = await Clinic.find({
      "purchasedServices.assignedDoctor": doctorId,
    })
      .populate("purchasedServices.serviceId", "serviceName price")
      .populate("purchasedServices.userId", "name")
      .select("name purchasedServices");

    let results: any[] = [];

    clinics.forEach((clinic) => {
      clinic.purchasedServices.forEach((srv: any) => {
        if (srv.assignedDoctor?.toString() === doctorId) {
          results.push({
            _id: srv._id,
            serviceName: srv.serviceId?.serviceName,
            userName: srv.userId?.name,
            quantity: srv.quantity,
            totalPrice: srv.totalPrice,
            purchasedAt: srv.purchasedAt,
            clinicName: clinic.name,
          });
        }
      });
    });

    res.json(results);
  } catch (error) {
    console.error("❌ Error fetching assigned services:", error);
    res.status(500).json({ message: "Failed to fetch assigned services" });
  }
});


export default router;
