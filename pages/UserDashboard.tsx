"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import styles from "@/styles/userdashboard.module.css";
import { FiUsers, FiUserPlus, FiLogOut, FiMenu, FiX } from "react-icons/fi";

import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";
import MobileNavbar from "@/components/Layout/MobileNavbar";
import UserProfile from "@/components/UserPanel/UserProfile";
import OrderHistory from "@/components/UserPanel/OrderHistory";
import AppointmentHistory from "@/components/UserPanel/AppointmentHistory";

interface User {
  name?: string;
  email?: string;
}

const UserDashboard = () => {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<User>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const username = Cookies.get("username");

    if (!token) {
      router.replace("/Login");
      return;
    }

    if (username) {
      // ✅ Load username directly from cookie
      setUser({ name: username });
      setLoading(false);
    } else {
      // ✅ Fallback: fetch from backend
      const fetchProfile = async () => {
        try {
          const res = await fetch("http://localhost:5000/api/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
            Cookies.set("username", data.name || ""); // cache for next time
          } else {
            console.error("Failed to fetch profile");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    router.replace("/Login");
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen && isMobile ? "hidden" : "auto";
  }, [sidebarOpen, isMobile]);

  if (loading) {
    return (
      <div className={styles.loaderWrapper}>
        <div className={styles.loader}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Topbar hideHamburgerOnMobile />

      {isMobile && (
        <div className={styles.mobileTopbar}>
          <button className={styles.menuToggle} onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      )}

      <div className={styles.wrapper}>
        <div className={styles.mainArea}>
          <aside
            className={`${styles.sidebar} ${
              isMobile ? (sidebarOpen ? styles.sidebarMobile : styles.sidebarHidden) : ""
            }`}
          >
            <p className={styles.sectionTitle}>Menu</p>
            <ul className={styles.menu}>
              <li
                onClick={() => {
                  setActiveSection("dashboard");
                  setSidebarOpen(false);
                }}
                className={styles.menuItem}
              >
                <span className={styles.iconLabel}>
                  <FiUsers className={styles.icon} />
                  <span className={styles.label}>Dashboard</span>
                </span>
              </li>

              <p className={styles.sectionTitle}>List</p>
              <li
                onClick={() => {
                  setActiveSection("userprofile");
                  setSidebarOpen(false);
                }}
                className={styles.menuItem}
              >
                <span className={styles.iconLabel}>
                  <FiUserPlus className={styles.icon} />
                  <span className={styles.label}>User Profile</span>
                </span>
              </li>

              <li
                onClick={() => {
                  setActiveSection("orderhistory");
                  setSidebarOpen(false);
                }}
                className={styles.menuItem}
              >
                <span className={styles.iconLabel}>
                  <FiUserPlus className={styles.icon} />
                  <span className={styles.label}>Order History</span>
                </span>
              </li>

              <li
                onClick={() => {
                  setActiveSection("appointmenthistory");
                  setSidebarOpen(false);
                }}
                className={styles.menuItem}
              >
                <span className={styles.iconLabel}>
                  <FiUserPlus className={styles.icon} />
                  <span className={styles.label}>Appointment History</span>
                </span>
              </li>
            </ul>

            <button className={styles.logoutButton} onClick={handleLogout}>
              <span className={styles.iconLabel}>
                <FiLogOut className={styles.icon} />
                <span className={styles.label}>Logout</span>
              </span>
            </button>
          </aside>

          <div className={styles.mainContent}>
            {activeSection === "dashboard" && (
              <div className={styles.welcomeBox}>
                <h2>Welcome, {user.name || "User"} 👋</h2>
              </div>
            )}

            {activeSection === "userprofile" && <UserProfile />}
            {activeSection === "orderhistory" && <OrderHistory />}
            {activeSection === "appointmenthistory" && <AppointmentHistory />}
          </div>
        </div>
      </div>

      <Footer />
      <MobileNavbar />
    </>
  );
};

export default UserDashboard;
