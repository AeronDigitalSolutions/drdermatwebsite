"use client";
import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/Offer.module.css";

interface Offer {
  _id: string;
  imageBase64: string;
}

const OfferComponent = () => {
  const [slides, setSlides] = useState<Offer[]>([]);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch offers from backend
  const fetchOffers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/offers");
      const data: Offer[] = await res.json();
      setSlides(data);
    } catch (err) {
      console.error("Failed to fetch offers", err);
    }
  };

  useEffect(() => {
    fetchOffers();

    // Poll backend every 3 seconds
    fetchIntervalRef.current = setInterval(fetchOffers, 3000);

    return () => {
      if (fetchIntervalRef.current) clearInterval(fetchIntervalRef.current);
    };
  }, []);

  // Auto scroll slider
  const startAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (slides.length ? (prev + 1) % slides.length : 0));
    }, 2000);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (slides.length > 0) startAutoScroll();
    return () => stopAutoScroll();
  }, [slides]);

  if (slides.length === 0) return <p style={{ textAlign: "center", padding: 20 }}>No offers available</p>;

  return (
    <div
      className={styles.sliderWrapper}
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <div
        className={styles.slider}
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className={styles.slide} key={slide._id}>
            <img
              src={slide.imageBase64}
              alt="Offer"
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`${styles.dot} ${idx === current ? styles.activeDot : ""}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default OfferComponent;
