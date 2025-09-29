import React, { useState } from "react";
import { FaHome, FaUserMd, FaUser } from "react-icons/fa";
import { MdFolder, MdOutlineAssignment, MdOutlineClose } from "react-icons/md";
import styles from "@/styles/mobileNavbar.module.css";
import Link from "next/link";

const MobileNavbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.navItem}>
          <FaHome className={styles.icon} />
          <span>
            <Link href="/home">Home</Link>
          </span>
        </div>

        <div className={styles.navItem}>
          <MdOutlineAssignment className={styles.icon} />
          <span>
            <Link href="/home/findClinicsPage">Book <br /></Link>
            Appointment
          </span>
        </div>

        <div
          className={`${styles.navItem} ${styles.centerItem}`}
          onClick={toggleDrawer}
        >
          {showDrawer ? (
            <MdOutlineClose className={styles.icon} />
          ) : (
            <MdFolder className={styles.icon} />
          )}
          <span>{showDrawer ? "Close" : "Your Result"}</span>
        </div>

        <div className={styles.navItem}>
          <FaUserMd className={styles.icon} />
          <span>Treatment</span>
        </div>

        <div className={styles.navItem}>
          <FaUser className={styles.icon} />
          <span>Profile</span>
        </div>
      </div>

      {showDrawer && (
        <div className={styles.drawer}>
          <div className={styles.drawerContent}>
            <h4>Your Links</h4>
            <ul>
              <li><a href="#">Your Orders</a></li>
              <li><a href="#">Online Consultations</a></li>
              <li><a href="#">Online Test Report</a></li>
              <li><a href="#">Your Gallery</a></li>
              <li><a href="#">Upload a Prescription</a></li>
              <li><a href="#">Recommended Products for you</a></li>
              <li><a href="#">Recommended Treatment Plans for you</a></li>
              <li><a href="#">Avail Special Offers & Discount</a></li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavbar;
