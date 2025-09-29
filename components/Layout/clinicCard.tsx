"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/components/Layout/clinicCard.module.css";
import { useRouter } from "next/navigation";
import { FaWhatsapp, FaMap } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ arrow icons
import MobileNavbar from "./MobileNavbar";

type Clinic = {
  _id: string;
  name: string;
  mobile?: string;
  whatsapp?: string;
  images?: string[];
  imageUrl?: string;
  reviews?: number;
  address?: string;
  description?: string;
  verified?: boolean;
  trusted?: boolean;
  mapLink?: string;
};

interface ClinicCardProps {
  clinic: Clinic;
}

const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images =
    clinic.images && clinic.images.length > 0
      ? clinic.images
      : clinic.imageUrl
      ? [clinic.imageUrl]
      : ["/placeholder-clinic.jpg"];

  // auto advance
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleCardClick = () => {
    router.push(`/clinics/${clinic._id}`);
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleCardClick();
      }}
    >
      <div className={styles.leftSection}>
        <div className={styles.imageWrapper}>
          <img
            src={images[currentImageIndex]}
            alt={clinic.name || "Clinic image"}
            className={styles.image}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "/placeholder-clinic.jpg";
            }}
          />
          {images.length > 1 && (
            <>
              <button className={styles.prevBtn} onClick={handlePrev}>
                <ChevronLeft size={24} />
              </button>
              <button className={styles.nextBtn} onClick={handleNext}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{clinic.name}</span>
          {clinic.verified && <span className={styles.verified}>✔ Verified</span>}
        </div>

        <div className={styles.ratingReviewRow}>
          <span className={styles.rating}>⭐ 4.5</span>
          <span className={styles.reviews}>{clinic.reviews ?? 0} Reviews</span>
          {clinic.trusted && <span className={styles.trust}>Trust</span>}
          <span className={styles.topSearch}>🔍 Top Search</span>
        </div>

        <div className={styles.addressRow}>
          📍 {clinic.address ?? "Address not set"}
        </div>

        <div className={styles.descriptionRow}>
          {clinic.description ?? "Open 24 Hrs • Experienced staff"}
        </div>

        <div className={styles.buttons}>
          <a
            href={clinic.mobile ? `tel:${clinic.mobile}` : "#"}
            onClick={(e) => e.stopPropagation()}
            className={styles.call}
          >
            <IoCall className={styles.icons} />
            Call
          </a>

          <a
            href={
              clinic.whatsapp
                ? `https://wa.me/${(clinic.whatsapp || "").replace(/\D/g, "")}`
                : "#"
            }
            onClick={(e) => e.stopPropagation()}
            className={styles.whatsapp}
            target="_blank"
            rel="noreferrer"
          >
            <FaWhatsapp className={styles.icons} />
            Whatsapp
          </a>

          {clinic.mapLink ? (
            <a
              href={clinic.mapLink}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={styles.call}
            >
              <FaMap className={styles.icons} />
              Direction
            </a>
          ) : (
            <button
              className={styles.direction}
              onClick={(e) => e.stopPropagation()}
            >
              <FaMap className={styles.icons} />
              Direction
            </button>
          )}

          <button
            className={styles.details}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/clinics/${clinic._id}`);
            }}
          >
            See Details
          </button>
        </div>
      </div>

      <MobileNavbar />
    </div>
  );
};

export default ClinicCard;
