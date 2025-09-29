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

  // ✅ Dropdown states
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [listDropdownOpen, setListDropdownOpen] = useState(false);

  // ✅ Auth check for SUPERADMIN
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
        setCheckingAuth(false);
        router.replace("/adminlogin");
        return;
      }

      setCheckingAuth(false);
    } catch {
      Cookies.remove("token");
      Cookies.remove("role");
      setCheckingAuth(false);
      router.replace("/adminlogin");
    }
  }, [router]);

  // ✅ Responsive sidebar
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

  // ✅ Logout
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    router.replace("/adminlogin");
  };

  // ✅ Auto-close dropdown when selecting
  const handleSectionChange = (section: string, close: "create" | "list") => {
    setActiveSection(section);
    setSidebarOpen(false);
    if (close === "create") setCreateDropdownOpen(false);
    if (close === "list") setListDropdownOpen(false);
  };

  if (checkingAuth) {
    return (
      <div className={styles.loading}>
        <p>Loading dashboard…</p>
      </div>
    );
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
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      )}

      <div className={styles.wrapper}>
        <div className={styles.mainArea}>
          {/* Sidebar */}
          <aside
            className={`${styles.sidebar} ${
              isMobile
                ? sidebarOpen
                  ? styles.sidebarMobile
                  : styles.sidebarHidden
                : ""
            }`}
          >
            <p className={styles.sectionTitle}>Menu</p>
            <ul className={styles.menu}>
              <li
                onClick={() => handleSectionChange("dashBoard", "list")}
                className={`${styles.menuItem} ${
                  activeSection === "dashBoard" ? styles.active : ""
                }`}
              >
                <span className={styles.iconLabel}>
                  <FiUsers className={styles.icon} />
                  <span className={styles.label}>Dashboard</span>
                </span>
              </li>

              {/* ✅ Dropdown for Create */}
              <p className={styles.sectionTitle}>Create</p>
              <li
                className={`${styles.menuItem} ${styles.dropdownHeader}`}
                onClick={() =>
                  setCreateDropdownOpen(!createDropdownOpen)
                }
              >
                <span className={styles.iconLabel}>
                  <FiUserPlus className={styles.icon} />
                  <span className={styles.label}>Create</span>
                </span>
                {createDropdownOpen ? <FiChevronDown /> : <FiChevronRight />}
              </li>
              {createDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <li
                    onClick={() => handleSectionChange("createAdmin", "create")}
                    className={`${styles.menuItem} ${
                      activeSection === "createAdmin" ? styles.active : ""
                    }`}
                  >
                    Create Admin
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("createClinicCategory", "create")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "createClinicCategory"
                        ? styles.active
                        : ""
                    }`}
                  >
                    Create Clinic Category
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("createProductCategory", "create")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "createProductCategory"
                        ? styles.active
                        : ""
                    }`}
                  >
                    Create Product Category
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("createServiceCategory", "create")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "createServiceCategory"
                        ? styles.active
                        : ""
                    }`}
                  >
                    Create Service Category
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("createClinic", "create")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "createClinic" ? styles.active : ""
                    }`}
                  >
                    Create Clinic
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("createProduct", "create")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "createProduct" ? styles.active : ""
                    }`}
                  >
                    Create Product
                  </li>
                </div>
              )}

              {/* ✅ Dropdown for List */}
              <p className={styles.sectionTitle}>List</p>
              <li
                className={`${styles.menuItem} ${styles.dropdownHeader}`}
                onClick={() => setListDropdownOpen(!listDropdownOpen)}
              >
                <span className={styles.iconLabel}>
                  <FiList className={styles.icon} />
                  <span className={styles.label}>Lists</span>
                </span>
                {listDropdownOpen ? <FiChevronDown /> : <FiChevronRight />}
              </li>
              {listDropdownOpen && (
                <div className={styles.dropdownContent}>
                  <li
                    onClick={() => handleSectionChange("listOfAdmin", "list")}
                    className={`${styles.menuItem} ${
                      activeSection === "listOfAdmin" ? styles.active : ""
                    }`}
                  >
                    List of Admin
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("listOfProductCategory", "list")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "listOfProductCategory"
                        ? styles.active
                        : ""
                    }`}
                  >
                    List of Product Category
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("listOfClinicCategory", "list")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "listOfClinicCategory"
                        ? styles.active
                        : ""
                    }`}
                  >
                    List of Clinic Category
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("listOfServiceCategory", "list")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "listOfServiceCategory"
                        ? styles.active
                        : ""
                    }`}
                  >
                    List of Service Category
                  </li>
                  <li
                    onClick={() => handleSectionChange("listOfClinic", "list")}
                    className={`${styles.menuItem} ${
                      activeSection === "listOfClinic" ? styles.active : ""
                    }`}
                  >
                    List of Clinic
                  </li>
                  <li
                    onClick={() => handleSectionChange("listOfProduct", "list")}
                    className={`${styles.menuItem} ${
                      activeSection === "listOfProduct" ? styles.active : ""
                    }`}
                  >
                    List of Product
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("listOfTopProduct", "list")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "listOfTopProduct" ? styles.active : ""
                    }`}
                  >
                    List of Top Product
                  </li>
                  <li
                    onClick={() => handleSectionChange("offerupdate", "list")}
                    className={`${styles.menuItem} ${
                      activeSection === "offerupdate" ? styles.active : ""
                    }`}
                  >
                    Offer Update
                  </li>
                  <li
                    onClick={() => handleSectionChange("latestshorts", "list")}
                    className={`${styles.menuItem} ${
                      activeSection === "latestshorts" ? styles.active : ""
                    }`}
                  >
                    Latest Shorts
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("latestofferupdate", "list")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "latestofferupdate"
                        ? styles.active
                        : ""
                    }`}
                  >
                    Latest Offer Update
                  </li>
                  <li
                    onClick={() =>
                      handleSectionChange("treatmentshorts", "list")
                    }
                    className={`${styles.menuItem} ${
                      activeSection === "treatmentshorts" ? styles.active : ""
                    }`}
                  >
                    Treatment Shorts Update
                  </li>
                </div>
              )}
            </ul>

            <button className={styles.logoutButton} onClick={handleLogout}>
              <span className={styles.iconLabel}>
                <FiLogOut className={styles.icon} />
                <span className={styles.label}>Logout</span>
              </span>
            </button>
          </aside>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {activeSection === "dashBoard" && <Dashboard />}
            {activeSection === "createAdmin" && <CreateAdmin />}
            {activeSection === "createProductCategory" && <CreateCategory />}
            {activeSection === "createClinicCategory" && <CreateClinicCategory />}
            {activeSection === "createServiceCategory" && <CreateServiceCategory />}
            {activeSection === "createClinic" && <CreateClinic />}
            {activeSection === "createProduct" && <CreateProduct />}
            {activeSection === "listOfAdmin" && <ListOfAdmin />}
            {activeSection === "listOfProductCategory" && <ListOfCategory />}
            {activeSection === "listOfClinicCategory" && <ListOfClinicCategory />}
            {activeSection === "listOfServiceCategory" && <ListOfServiceCategory />}
            {activeSection === "listOfClinic" && <ListOfClinic />}
            {activeSection === "listOfProduct" && <ListOfProduct />}
            {activeSection === "listOfTopProduct" && <ListOfTopProduct />}
            {activeSection === "offerupdate" && <UpdateOffer />}
            {activeSection === "latestofferupdate" && <LatestUpdateOffer />}
            {activeSection === "latestshorts" && <LatestShorts />}
            {activeSection === "treatmentshorts" && <TreatmentShorts />}
          </div>
        </div>
      </div>

      <Footer />
      <MobileNavbar />
    </>
  );
}
