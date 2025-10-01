"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/components/Layout/FeaturedSection.module.css";
import { useRouter } from "next/router";
import MobileNavbar from "./MobileNavbar";

type ImageSliderItem = {
  url: string;
  heading: string;
};

type ImageSliderProps = {
  slides: ImageSliderItem[];
  loading: boolean;
};

const FeaturedSection = ({ slides, loading }: ImageSliderProps) => {
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

  const imagePaths = ["/home/findClinicsPage", "/#", "/#"];

  const handleImageClick = (index: number) => {
    router.push(imagePaths[index] || "/");
  };

  useEffect(() => {
    if (!loading) {
      setAnimate(true); // Trigger animations after loading finishes
    }
  }, [loading]);

  return (
    <div className={styles.featuredSection}>
      {/* Slider */}
      <div className={styles.sliderWrapper}>
        {slides.map((slide, index) => {
          let animationClass = "";

          if (animate) {
            if (index === 0) {
              animationClass = styles.leftImage;
            } else if (index === 1) {
              animationClass = styles.centerImage;
            } else if (index === 2) {
              animationClass = styles.rightImage;
            }
          }

          return (
            <div
              key={index}
              className={`${styles.imageContainer} ${animationClass}`}
              onClick={() => handleImageClick(index)}
            >
              <img
                src={slide.url}
                alt={`Slide ${index}`}
                className={styles.imageSliderImage}
              />
              <div className={styles.imageOverlay}>
                <h3 className={styles.imageHeading}>{slide.heading}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${index === 1 ? styles.activeDot : ""}`}
          />
        ))}
      </div>

      <MobileNavbar />
    </div>
  );
};

export default FeaturedSection;
  