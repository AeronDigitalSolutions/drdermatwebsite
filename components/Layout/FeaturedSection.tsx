import React, { useEffect, useRef, useState } from "react";
import styles from "@/styles/components/Layout/FeaturedSection.module.css";
import { useRouter } from "next/router";
import MobileNavbar from "./MobileNavbar";

type ImageSliderItem = {
  url: string;
  heading: string;
};

type ImageSliderProps = {
  slides: ImageSliderItem[];
};

const FeaturedSection = ({ slides }: ImageSliderProps) => {
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const imagePaths = ["/home/findClinicsPage", "/#", "/#"];

  const handleImageClick = (index: number) => {
    router.push(imagePaths[index]);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const index = Number(visibleEntry.target.getAttribute("data-index"));
          setImageIndex(index);
        }
      },
      {
        root: el,
        threshold: 0.5,
      }
    );

    const children = el.querySelectorAll(`.${styles.imageContainer}`);
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.featuredSection}>
      {/* Slider */}
      <div ref={scrollRef} className={styles.sliderWrapper}>
        {slides.map((slide, index) => (
          <div
            key={index}
            data-index={index}
            className={styles.imageContainer}
            onClick={() => handleImageClick(index)}
          >
            <img src={slide.url} alt={`Slide ${index}`} className={styles.imageSliderImage} />
            <div className={styles.imageOverlay}>
              <h3 className={styles.imageHeading}>{slide.heading}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${imageIndex === index ? styles.activeDot : ""}`}
          />
        ))}
      </div>

      <MobileNavbar />
    </div>
  );
};

export default FeaturedSection;
