// models/clinic.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IClinic extends Document {
  name: string;
  mobile: string;
  whatsapp?: string;
  mapLink?: string;
  address: string;
  verified: boolean;
  trusted: boolean;
  images: string[];
  email: string;
  password: string;
  category: mongoose.Types.ObjectId;

  purchasedServices: {
    serviceId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    quantity: number;
    totalPrice: number;
    purchasedAt: Date;
  }[];

  comparePassword(candidate: string): Promise<boolean>;
}

const ClinicSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    whatsapp: { type: String },
    mapLink: { type: String },
    address: { type: String, required: true },
    verified: { type: Boolean, default: false },
    trusted: { type: Boolean, default: false },
    images: { type: [String], required: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    category: {
      type: Schema.Types.ObjectId,
      ref: "ClinicCategory",
      required: true,
    },

    // models/clinic.ts (only show purchasedServices part)
purchasedServices: [
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service" },
    userId: { type: Schema.Types.ObjectId, ref: "UserProfile" },
    quantity: Number,
    totalPrice: Number,
    purchasedAt: { type: Date, default: Date.now },
    assignedDoctor: { type: Schema.Types.ObjectId, ref: "Doctor", default: null } // <- added
  },
],

  },
  { timestamps: true }
);

ClinicSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

ClinicSchema.methods.comparePassword = async function (candidate: string) {
  return await bcrypt.compare(candidate, this.password);
};

export default mongoose.models.Clinic ||
  mongoose.model<IClinic>("Clinic", ClinicSchema);
