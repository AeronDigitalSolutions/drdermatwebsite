"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/components/Layout/Topbar.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { ShoppingCart, MapPin, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Cookies from "js-cookie";

interface TopbarProps {
  hideHamburgerOnMobile?: boolean;
}

const Topbar: React.FC<TopbarProps> = ({ hideHamburgerOnMobile }) => {
  const router = useRouter();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [username, setUsername] = useState<string | null>(null);

  // ✅ Load username from cookies when component mounts
  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleClick = () => {
    router.push("/home/Cart");
  };

  // 📍 Handle user location fetch
  const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          if (data?.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village;
            const state = data.address.state;
            setLocation(`${city || "Unknown"}, ${state || ""}`);
          } else {
            setLocation(
              `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
            );
          }
        } catch (err) {
          console.error("Error fetching location:", err);
          setLocation(
            `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`
          );
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    setUsername(null);
    router.push("/Login");
  };

  return (
    <div className={styles.topbar}>
      {/* Left section: Logo + Nav links */}
      <div className={styles.leftSection}>
        <Image
          className={styles.logo}
          src="/logo.png"
          alt="Logo"
          width={120}
          height={36}
          onClick={() => router.push("/home")}
        />

        <div
          className={`${styles.hamburger} ${
            hideHamburgerOnMobile ? styles.hideOnMobile : ""
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={26} />
        </div>

        <nav className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          <Link href="/home" className={styles.navLink}>
            Home
          </Link>
          <Link href="/home/findClinicsPage" className={styles.navLink}>
            Book Appointment
          </Link>
          <Link href="/quiz/ques1" className={styles.navLink}>
            Your Result
          </Link>
          <Link href="/user/profile" className={styles.navLink}>
            Care Plan
          </Link>
        </nav>
      </div>

      {/* Right section: Icons + Auth */}
      <div className={styles.rightSection}>
        <div className={styles.location} onClick={fetchLocation}>
          <MapPin size={18} />
          {location && <span className={styles.locationText}>{location}</span>}
        </div>

        {username ? (
          <div className={styles.userSection}>
            <span className={styles.userName}>{username.toUpperCase()}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </div>
        ) : (
          <div className={styles.authLinks}>
            <Link href="/Login">Login</Link>
            <span className={styles.separator}>|</span>
            <Link href="/Signups">Sign Up</Link>
          </div>
        )}

        <div className={styles.cartInfo} onClick={handleClick}>
          <ShoppingCart size={18} />
          {cartCount > 0 && (
            <span className={styles.cartBadge}>{cartCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
