"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// Routes
const AuthRouter_1 = __importDefault(require("./src/routes/AuthRouter"));
const UserRouter_1 = __importDefault(require("./src/routes/UserRouter"));
const AdminRouter_1 = __importDefault(require("./src/routes/AdminRouter"));
const Category_1 = __importDefault(require("./src/routes/Category"));
const clinicRoutes_1 = __importDefault(require("./src/routes/clinicRoutes"));
const productRoutes_1 = __importDefault(require("./src/routes/productRoutes"));
const appointmentsRoutes_1 = __importDefault(require("./src/routes/appointmentsRoutes"));
const doctorRoutes_1 = __importDefault(require("./src/routes/doctorRoutes"));
const EditClinicRoutes_1 = __importDefault(require("./src/routes/EditClinicRoutes"));
const serviceRoutes_1 = __importDefault(require("./src/routes/serviceRoutes"));
const offerRotes_1 = __importDefault(require("./src/routes/offerRotes"));
const admindoctorRoutes_1 = __importDefault(require("./src/routes/admindoctorRoutes"));
const serviceCategoryRoutes_1 = __importDefault(require("./src/routes/serviceCategoryRoutes"));
const clinicCategoryRoutes_1 = __importDefault(require("./src/routes/clinicCategoryRoutes"));
const TopProducts_1 = __importDefault(require("./src/routes/TopProducts"));
const latestofferRoutes_1 = __importDefault(require("./src/routes/latestofferRoutes"));
const latestshortsRoutes_1 = __importDefault(require("./src/routes/latestshortsRoutes"));
const quizRoutes_1 = __importDefault(require("./src/routes/quizRoutes"));
const treatmentshortsRoutes_1 = __importDefault(require("./src/routes/treatmentshortsRoutes")); // 👈 New
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '20mb' }));
app.use("/api/offers", offerRotes_1.default);
app.use("/api/latest-shorts", latestshortsRoutes_1.default);
// Static folder for serving uploaded images
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
app.use("/api/doctoradmin", admindoctorRoutes_1.default);
app.use('/api/quiz', quizRoutes_1.default);
// API routes
app.use('/api/clinics', clinicRoutes_1.default);
app.use("/api/treatment-shorts", treatmentshortsRoutes_1.default); // 👈 New
app.use('/api/auth', AuthRouter_1.default);
app.use('/api/users', UserRouter_1.default);
app.use('/api/admins', AdminRouter_1.default);
app.use('/api/categories', Category_1.default);
app.use('/api/products', productRoutes_1.default);
app.use("/api/appointments", appointmentsRoutes_1.default);
app.use("/api/doctors", doctorRoutes_1.default);
app.use("/api/editclinics", EditClinicRoutes_1.default);
app.use("/api/services", serviceRoutes_1.default);
app.use("/api/clinic-categories", clinicCategoryRoutes_1.default);
app.use("/api/top-products", TopProducts_1.default);
app.use("/api/latest-offers", latestofferRoutes_1.default);
app.use("/api/service-categories", serviceCategoryRoutes_1.default);
// MongoDB connection and server start
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
    .catch((err) => console.error('❌ MongoDB connection error:', err));
