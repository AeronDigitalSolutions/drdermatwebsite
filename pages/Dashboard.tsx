"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import CreateAdmin from "@/components/AdminPanel/CreateAdmin";
import CreateCategory from "@/components/AdminPanel/CreateProductCategory";
import CreateClinicCategory from "@/components/AdminPanel/CreateClinicCategory";
import CreateClinic from "@/components/AdminPanel/CreateClinic";
import CreateProduct from "@/components/AdminPanel/CreateProduct";
import Dashboard from "@/components/AdminPanel/Dashboard";
import ListOfAdmin from "@/components/AdminPanel/ListOfAdmin";
import ListOfCategory from "@/components/AdminPanel/ListOfCategory";
import ListOfClinicCategory from "@/components/AdminPanel/ListOfClinicCategory";
import ListOfClinic from "@/components/AdminPanel/ListOfClinic";
import ListOfProduct from "@/components/AdminPanel/ListOfProduct";
import CreateServiceCategory from "@/components/AdminPanel/CreateServiceCategory";
import ListOfServiceCategory from "@/components/AdminPanel/ListOfServiceCategory";
import ListOfTopProduct from "@/components/AdminPanel/ListOfTopProduct";
import UpdateOffer from "@/components/AdminPanel/UpdateOffer";
import LatestUpdateOffer from "@/components/AdminPanel/LatestUpdateOffer";
import LatestShorts from "@/components/AdminPanel/LatestShorts";
import TreatmentShorts from "@/components/AdminPanel/TreatmentShorts";
import CreateTreatment from "@/components/AdminPanel/CreateTreatment";
import CreatePatient from "@/components/AdminPanel/CreatePatient";
import CreateTestResult from "@/components/AdminPanel/CreateTestResult";
import CreateOnlineDoctor from "@/components/AdminPanel/CreateOnlineDoctor";
import CreateB2BProduct from "@/components/AdminPanel/CreateB2BProduct";
import CreateSupport from "@/components/AdminPanel/CreateSupport";
import UserOrderHistory from "@/components/AdminPanel/UserOrderHistory";

import styles from "@/styles/dashboard.module.css";
import {
  FiUsers,
  FiUserPlus,
  FiList,
  FiMenu,
  FiX,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";
import MobileNavbar from "@/components/Layout/MobileNavbar";

type JwtPayload = { id: string; role: string; exp: number };

export default function SuperAdminDashboard() {
  const router = useRouter();

  const [activeSection, setActiveSection] = useState("dashBoard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // OLD dropdowns (kept)
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [listDropdownOpen, setListDropdownOpen] = useState(false);

  // ✅ NEW: per-category dropdown states (THIS IS THE FIX)
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setCheckingAuth(false);
      router.replace("/adminlogin");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (
        decoded.exp * 1000 < Date.now() ||
        decoded.role?.toLowerCase() !== "superadmin"
      ) {
        Cookies.remove("token");
        Cookies.remove("role");
        router.replace("/adminlogin");
        return;
      }
      setCheckingAuth(false);
    } catch {
      Cookies.remove("token");
      Cookies.remove("role");
      router.replace("/adminlogin");
    }
  }, [router]);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen && isMobile ? "hidden" : "auto";
  }, [sidebarOpen, isMobile]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.replace("/adminlogin");
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  if (checkingAuth) {
    return <div className={styles.loading}>Loading dashboard…</div>;
  }

  return (
    <>
      <Topbar hideHamburgerOnMobile />

      {isMobile && (
        <div className={styles.mobileTopbar}>
          <button
            className={styles.menuToggle}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      )}

      <div className={styles.wrapper}>
        <aside
          className={`${styles.sidebar} ${
            isMobile
              ? sidebarOpen
                ? styles.sidebarMobile
                : styles.sidebarHidden
              : ""
          }`}
        >
          <p className={styles.sectionTitle}>Dashboard</p>

          <li
            className={styles.menuItem}
            onClick={() => handleSectionChange("dashBoard")}
          >
            <FiUsers /> Dashboard
          </li>

          {/* ========= CATEGORY BLOCKS ========= */}

          {[
            {
              key: "ADMIN",
              create: "createAdmin",
              list: "listOfAdmin",
            },
            {
              key: "CLINIC CATEGORY",
              create: "createClinicCategory",
              list: "listOfClinicCategory",
            },
            {
              key: "PRODUCT CATEGORY",
              create: "createProductCategory",
              list: "listOfProductCategory",
            },
            {
              key: "SERVICE CATEGORY",
              create: "createServiceCategory",
              list: "listOfServiceCategory",
            },
            {
              key: "CLINIC",
              create: "createClinic",
              list: "listOfClinic",
            },
            {
              key: "PRODUCT",
              create: "createProduct",
              list: "listOfProduct",
            },
          ].map((cat) => (
            <div key={cat.key}>
              <li
                className={styles.menuItem}
                onClick={() =>
                  setOpenCategory(openCategory === cat.key ? null : cat.key)
                }
              >
                {cat.key}
                {openCategory === cat.key ? (
                  <FiChevronDown />
                ) : (
                  <FiChevronRight />
                )}
              </li>

              {openCategory === cat.key && (
                <ul className={styles.inlineDropdown}>
                  <li onClick={() => handleSectionChange(cat.create)}>
                    Create
                  </li>
                  <li onClick={() => handleSectionChange(cat.list)}>
                    List
                  </li>
                </ul>
              )}
            </div>
          ))}

          {/* OTHERS */}
          <li
            className={styles.menuItem}
            onClick={() =>
              setOpenCategory(openCategory === "OTHERS" ? null : "OTHERS")
            }
          >
            OTHERS
            {openCategory === "OTHERS" ? (
              <FiChevronDown />
            ) : (
              <FiChevronRight />
            )}
          </li>

          {openCategory === "OTHERS" && (
            <ul className={styles.inlineDropdown}>
              <li onClick={() => handleSectionChange("listOfTopProduct")}>
                List Top Product
              </li>
              <li onClick={() => handleSectionChange("offerupdate")}>
                Offer Update
              </li>
              <li onClick={() => handleSectionChange("latestshorts")}>
                Latest Shorts
              </li>
              <li onClick={() => handleSectionChange("latestofferupdate")}>
                Latest Offer Update
              </li>
              <li onClick={() => handleSectionChange("treatmentshorts")}>
                Treatment Shorts
              </li>
              <li onClick={() => handleSectionChange("userorderhistory")}>
                User Order History
              </li>
            </ul>
          )}

          <button className={styles.logoutButton} onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </aside>

        {/* MAIN CONTENT – RIGHT SIDE */}
        <div className={styles.mainContent}>
          {activeSection === "dashBoard" && <Dashboard />}
          {activeSection === "createAdmin" && <CreateAdmin />}
          {activeSection === "listOfAdmin" && <ListOfAdmin />}
          {activeSection === "createClinicCategory" && <CreateClinicCategory />}
          {activeSection === "listOfClinicCategory" && <ListOfClinicCategory />}
          {activeSection === "createProductCategory" && <CreateCategory />}
          {activeSection === "listOfProductCategory" && <ListOfCategory />}
          {activeSection === "createServiceCategory" && <CreateServiceCategory />}
          {activeSection === "listOfServiceCategory" && (
            <ListOfServiceCategory />
          )}
          {activeSection === "createClinic" && <CreateClinic />}
          {activeSection === "listOfClinic" && <ListOfClinic />}
          {activeSection === "createProduct" && <CreateProduct />}
          {activeSection === "listOfProduct" && <ListOfProduct />}
          {activeSection === "listOfTopProduct" && <ListOfTopProduct />}
          {activeSection === "offerupdate" && <UpdateOffer />}
          {activeSection === "latestshorts" && <LatestShorts />}
          {activeSection === "latestofferupdate" && <LatestUpdateOffer />}
          {activeSection === "treatmentshorts" && <TreatmentShorts />}
          {activeSection === "userorderhistory" && <UserOrderHistory />}
          {activeSection === "createPatient" && <CreatePatient />}
          {activeSection === "createTestResult" && <CreateTestResult />}
          {activeSection === "createOnlineDoctor" && <CreateOnlineDoctor />}
          {activeSection === "createB2Bproduct" && <CreateB2BProduct />}
          {activeSection === "createSupport" && <CreateSupport />}
          {activeSection === "createTreatment" && <CreateTreatment />}
        </div>
      </div>

      <Footer />
      <MobileNavbar />
    </>
  );
}
