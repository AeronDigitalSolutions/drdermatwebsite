"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/topproducts.module.css";
import { useCart } from "@/context/CartContext";
import { FaCartPlus, FaHeart, FaSearch, FaArrowRight } from "react-icons/fa";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  category?: string;
  company?: string;
  price?: number | string;
  discountPrice?: number | string;
  discount?: number | string;
  images?: string[];
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const TopProducts: React.FC = () => {
  const [topProducts, setTopProducts] = useState<(Product | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mainImages, setMainImages] = useState<Record<string, string>>({});
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const router = useRouter();
  const { addToCart } = useCart();

  const getImage = (img?: string) => {
    if (!img) return "/product1.png";
    if (img.startsWith("data:")) return img;
    return img;
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/top-products`);
        if (!res.ok) throw new Error("Failed to fetch top products");
        const data: (Product | null)[] = await res.json();
        setTopProducts(data);

        const initialMain: Record<string, string> = {};
        data.forEach((p) => {
          const key = p?.id || p?._id;
          if (key && p?.images?.length) initialMain[key] = p.images[0];
        });
        setMainImages(initialMain);
      } catch (err: any) {
        setError(err.message || "Failed to load top products");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const price = Number(product.price) || 0;
    const discountPrice = Number(product.discountPrice) || price;
    const hasDiscount = discountPrice < price;
    const discountPercent = hasDiscount
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

    addToCart({
      id: product.id || product._id!,
      name: product.name,
      price: discountPrice,
      mrp: price,
      discount: hasDiscount ? `${discountPercent}% OFF` : undefined,
      discountPrice: discountPrice,
      company: product.company,
      image: product.images?.[0],
    });

    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    alert(`Proceeding to checkout for ${product.name}`);
  };

  /* 🔥 NEW: limit to 17 products */
  const displayProducts = topProducts.slice(0, 17);

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {displayProducts.map((product, idx) => {
          if (!product) {
            return (
              <div key={idx} className={styles.card}>
                <p className={styles.empty}>Empty Slot</p>
              </div>
            );
          }

          const productId = product.id || product._id;
          const price = Number(product.price) || 0;
          const discount =
            Number(product.discountPrice ?? product.discount) || price;
          const hasDiscount = discount < price && price > 0;
          const discountPercent = hasDiscount
            ? Math.round(((price - discount) / price) * 100)
            : 0;

          const mainImage = productId
            ? mainImages[productId] || product.images?.[0]
            : product.images?.[0];

          return (
            <div
              key={productId || idx}
              className={styles.card}
              onClick={() => router.push(`/product/${productId}`)}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={styles.imageWrapper}>
                {mainImage ? (
                  <img
                    src={getImage(mainImage)}
                    alt={product.name}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>No Image</div>
                )}

                {hasDiscount && (
                  <span className={styles.badge}>-{discountPercent}%</span>
                )}

                {hoveredIndex === idx && window.innerWidth > 640 && (
                  <div className={styles.overlay}>
                    <div className={styles.iconContainer}>
                      <FaCartPlus
                        className={styles.icon}
                        onClick={(e) => handleAddToCart(e, product)}
                      />
                      <FaHeart className={styles.icon} />
                      <FaSearch className={styles.icon} />
                    </div>
                  </div>
                )}
              </div>

              <h3 className={styles.name}>{product.name}</h3>
              {product.company && (
                <p className={styles.company}>{product.company}</p>
              )}

              <div className={styles.priceRow}>
                {hasDiscount ? (
                  <>
                    <span className={styles.discountPrice}>₹{discount}</span>
                    <span className={styles.originalPrice}>₹{price}</span>
                  </>
                ) : (
                  <span className={styles.discountPrice}>₹{price}</span>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.addToCart}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </button>
                <button
                  className={styles.buyNow}
                  onClick={(e) => handleBuyNow(e, product)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          );
        })}

        {/* 🔥 18th TILE — SHOW MORE */}
        <div
          className={`${styles.card} ${styles.showMore}`}
          onClick={() => router.push("/products")}
        >
          <FaArrowRight size={32} />
          <span>Show More</span>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
