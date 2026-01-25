"use client";

import React, { useState, useEffect } from "react";
import styles from "@/styles/Dashboard/createclinic.module.css";
import MobileNavbar from "../Layout/MobileNavbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

/* ================= TYPES ================= */
interface Doctor {
  name: string;
  regNo: string;
  specialization: string;
}

interface ClinicCategory {
  _id: string;
  name: string;
}

export default function CreateClinic() {
  const [cuc] = useState(`CUC-${Date.now().toString().slice(-6)}`);

  /* ================= CATEGORY STATE ================= */
  const [categories, setCategories] = useState<ClinicCategory[]>([]);

  /* ================= DOCTOR MODAL STATE ================= */
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorForm, setDoctorForm] = useState<Doctor>({
    name: "",
    regNo: "",
    specialization: "",
  });

  /* ================= MAIN FORM STATE ================= */
  const [form, setForm] = useState({
    clinicName: "",
    dermaCategory: "", // ✅ ObjectId ONLY

    clinicType: "",
    ownerName: "",
    website: "",

    address: "",
    city: "",
    services: "",
    sector: "",
    pincode: "",
    mapLink: "",
    contactNumber: "",
    whatsapp: "",
    email: "",
    workingHours: "",

    licenseNo: "",
    experience: "",

    treatmentsAvailable: "",
    availableServices: "",
    consultationFee: "",
    bookingMode: "",

    clinicDescription: "",
    ratings: "",
    reviews: "",
    replyReviews: "",
    patientStories: "",
    updates: "",

    instagram: "",
    linkedin: "",
    facebook: "",

    billingPayments: "",
    subscriptionPlan: "",
    myLeads: "",
    settings: "",
    privacyPolicy: "",

    standardPlanLink: "",
    clinicStatus: "Open",
    verified: false,
    active: true,
    leadsNotification: false,
    logout: false,
  });

  /* ================= FETCH CLINIC CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/clinic-categories`);
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({
      ...prev,
      dermaCategory: e.target.value, // ✅ ObjectId
    }));
  };

  const handleDoctorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorForm((prev) => ({ ...prev, [name]: value }));
  };

  const saveDoctor = () => {
    if (!doctorForm.name || !doctorForm.regNo || !doctorForm.specialization) {
      alert("Please fill all doctor details");
      return;
    }
    setDoctors((prev) => [...prev, doctorForm]);
    setDoctorForm({ name: "", regNo: "", specialization: "" });
    setShowDoctorModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.dermaCategory) {
      alert("Please select clinic category");
      return;
    }

    const payload = {
      cuc,
      ...form,
      doctors,
    };

    const res = await fetch(`${API_URL}/clinics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    res.ok
      ? alert("✅ Clinic created successfully")
      : alert("❌ Failed to create clinic");
  };

  /* ================= JSX ================= */
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Create Clinic Profile</h1>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* ================= 1. CLINIC IDENTITY ================= */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Clinic Identity</h2>

            <input value={cuc} disabled className={styles.readonlyInput} />

            <input
              className={styles.input}
              name="clinicName"
              placeholder="Clinic (Hospital) Name"
              onChange={handleChange}
            />

            {/* ✅ SINGLE DYNAMIC CATEGORY FIELD */}
            <select
              className={styles.input}
              value={form.dermaCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select Clinic Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input className={styles.input} name="clinicType" placeholder="Clinic Type" onChange={handleChange} />
            <input className={styles.input} name="ownerName" placeholder="Owner (Founder) Name" onChange={handleChange} />
            <input className={styles.input} name="website" placeholder="Website" onChange={handleChange} />
          </section>

        {/* 2. BRANDING & MEDIA (FIXED – ALL REQUIRED FIELDS) */} <section className={styles.section}> <h2 className={styles.sectionTitle}>Branding & Media</h2> <div className={styles.field}> <label>Clinic Logo</label> <input type="file" className={styles.input} /> </div> <div className={styles.field}> <label>Banner Image</label> <input type="file" className={styles.input} /> </div> <div className={styles.field}> <label>Special Offers (Images)</label> <input type="file" multiple className={styles.input} /> </div> <div className={styles.field}> <label>Rate Card / Catalogue</label> <input type="file" className={styles.input} /> </div> <div className={styles.field}> <label>Photos</label> <input type="file" multiple className={styles.input} /> </div> <div className={styles.field}> <label>Videos</label> <input type="file" multiple className={styles.input} /> </div> <div className={styles.field}> <label>Certifications / Awards (Images)</label> <input type="file" multiple className={styles.input} /> </div> </section>

          {/* 3. DOCTORS & EXPERTISE (UPDATED ONLY SECTION) */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Doctors & Expertise</h2>

            <button
              type="button"
              className={styles.addDoctorBtn}
              onClick={() => setShowDoctorModal(true)}
            >
              + Add Doctor
            </button>

            {doctors.map((doc, i) => (
              <div key={i} className={styles.doctorCard}>
                <strong>{doc.name}</strong>
                <span>Reg No: {doc.regNo}</span>
                <span>{doc.specialization}</span>
              </div>
            ))}

            <input
              className={styles.input}
              name="standardPlanLink"
              placeholder="Standard Treatment Plan Link"
              onChange={handleChange}
            />
          </section>

{/* 4. LOCATION & CONTACT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Location & Contact</h2>

            <textarea className={styles.textarea} name="address" placeholder="Clinic Address" onChange={handleChange} />
            <input className={styles.input} name="city" placeholder="City" onChange={handleChange} />
            <input className={styles.input} name="services" placeholder="Services" onChange={handleChange} />
            <input className={styles.input} name="sector" placeholder="Sector" onChange={handleChange} />
            <input className={styles.input} name="pincode" placeholder="Pin Code" onChange={handleChange} />
            <input className={styles.input} name="mapLink" placeholder="Google Maps Link" onChange={handleChange} />
            <input className={styles.input} name="contactNumber" placeholder="Clinic Contact Number" onChange={handleChange} />
            <input className={styles.input} name="email" placeholder="Email Address" onChange={handleChange} />
            <input className={styles.input} name="whatsapp" placeholder="Whatsapp Contact" onChange={handleChange} />
            <input className={styles.input} name="workingHours" placeholder="Working Hours / Days" onChange={handleChange} />
          </section>

          {/* 5. OPERATIONS & LEGAL */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Operations & Legal</h2>

            <input className={styles.input} name="licenseNo" placeholder="Clinic Establishment License No." onChange={handleChange} />
            <input className={styles.input} name="experience" placeholder="Years of Experience" onChange={handleChange} />
          </section>

          {/* 6. SERVICES & TREATMENTS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Services & Treatments</h2>

            <textarea className={styles.textarea} name="treatmentsAvailable" placeholder="Treatments Available" onChange={handleChange} />
            <textarea className={styles.textarea} name="availableServices" placeholder="Available Services" onChange={handleChange} />
          </section>

          {/* 7. PRICING & BOOKING */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pricing & Booking</h2>

            <input className={styles.input} name="consultationFee" placeholder="Consultation Fee" onChange={handleChange} />
            <input className={styles.input} name="bookingMode" placeholder="Booking Mode" onChange={handleChange} />
          </section>

          {/* 8. CONTENT & ENGAGEMENT */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Content & Engagement</h2>

            <textarea className={styles.textarea} name="clinicDescription" placeholder="Clinic Description" onChange={handleChange} />
            <input className={styles.input} name="ratings" placeholder="Ratings" onChange={handleChange} />
            <textarea className={styles.textarea} name="reviews" placeholder="Reviews" onChange={handleChange} />
            <textarea className={styles.textarea} name="replyReviews" placeholder="Reply to Reviews" onChange={handleChange} />
            <textarea className={styles.textarea} name="patientStories" placeholder="Patient Stories" onChange={handleChange} />
            <textarea className={styles.textarea} name="updates" placeholder="Add Updates" onChange={handleChange} />
          </section>

          {/* 9. SOCIAL */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Social Presence</h2>

            <input className={styles.input} name="instagram" placeholder="Instagram" onChange={handleChange} />
            <input className={styles.input} name="linkedin" placeholder="LinkedIn" onChange={handleChange} />
            <input className={styles.input} name="facebook" placeholder="Facebook" onChange={handleChange} />
          </section>

          {/* 10. BUSINESS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Business & Subscription</h2>

            <input className={styles.input} name="billingPayments" placeholder="Billing & Payments" onChange={handleChange} />
            <input className={styles.input} name="subscriptionPlan" placeholder="Subscription Plan" onChange={handleChange} />
            <input className={styles.input} name="myLeads" placeholder="My Leads" onChange={handleChange} />
            <input className={styles.input} name="settings" placeholder="Settings" onChange={handleChange} />
            <textarea className={styles.textarea} name="privacyPolicy" placeholder="Privacy Policy" onChange={handleChange} />
          </section>

          {/* 11. ADMIN */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Admin & System</h2>

            <label className={styles.checkbox}>
              <input type="checkbox" name="verified" onChange={handleChange} /> Verified Badge
            </label>

            <label className={styles.checkbox}>
              <input type="checkbox" name="active" defaultChecked onChange={handleChange} /> Active / Block by Admin
            </label>

            <label className={styles.checkbox}>
              <input type="checkbox" name="leadsNotification" onChange={handleChange} /> Leads Notification
            </label>

            <label className={styles.checkbox}>
              <input type="checkbox" name="logout" onChange={handleChange} /> Log out
            </label>
          </section>
          <button className={styles.submitBtn}>Create Clinic</button>
        </form>
      </div>

      {/* DOCTOR MODAL */}
      {showDoctorModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Add Doctor</h3>
            <input className={styles.input} name="name" placeholder="Doctor Name" value={doctorForm.name} onChange={handleDoctorChange} />
            <input className={styles.input} name="regNo" placeholder="Registration No" value={doctorForm.regNo} onChange={handleDoctorChange} />
            <input className={styles.input} name="specialization" placeholder="Specialization" value={doctorForm.specialization} onChange={handleDoctorChange} />
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setShowDoctorModal(false)}>Cancel</button>
              <button type="button" onClick={saveDoctor}>Save Doctor</button>
            </div>
          </div>
        </div>
      )}

      <MobileNavbar />
    </div>
  );
}