import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';

// Routes
import authRoutes from './src/routes/AuthRouter';
import userRoutes from './src/routes/UserRouter';
import adminRoutes from './src/routes/AdminRouter';
import categoryRoutes from './src/routes/Category';
import clinicRoutes from './src/routes/clinicRoutes';
import productRoutes from './src/routes/productRoutes';
import appointmentRoutes from "./src/routes/appointmentsRoutes";
import doctorRoutes from "./src/routes/doctorRoutes";
import editClinicRoutes from "./src/routes/EditClinicRoutes";
import serviceRoutes from "./src/routes/serviceRoutes";
import offerRoutes from "./src/routes/offerRotes";
import doctorAdminRoutes from "./src/routes/admindoctorRoutes";

import serviceCategoryRoutes from "./src/routes/serviceCategoryRoutes";
import clinicCategoryRoutes from "./src/routes/clinicCategoryRoutes";

import topProductsRoute from "./src/routes/TopProducts";
import latestOfferRoutes from "./src/routes/latestofferRoutes";
import latestShortRoutes from "./src/routes/latestshortsRoutes";
import quizRoutes from './src/routes/quizRoutes';


import treatmentShortsRoutes from "./src/routes/treatmentshortsRoutes"; // 👈 New



dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use("/api/offers", offerRoutes);
app.use("/api/latest-shorts", latestShortRoutes);
// Static folder for serving uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/api/doctoradmin", doctorAdminRoutes);
app.use('/api/quiz', quizRoutes);


// API routes
app.use('/api/clinics', clinicRoutes);
app.use("/api/treatment-shorts", treatmentShortsRoutes); // 👈 New

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  
app.use('/api/admins', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/editclinics", editClinicRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/clinic-categories", clinicCategoryRoutes);
app.use("/api/top-products", topProductsRoute);
app.use("/api/latest-offers", latestOfferRoutes);
app.use("/api/service-categories", serviceCategoryRoutes);

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
