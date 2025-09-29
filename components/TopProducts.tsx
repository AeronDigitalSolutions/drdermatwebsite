"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/topproducts.module.css";
import { useCart } from "@/context/CartContext";

interface Product {
  _id?: string;
  id?: string; // ✅ custom product ID (PROD-xxxx)
  name: string;
  category?: string;
  company?: string;
  price?: number | string;
  discountPrice?: number | string;
  discount?: number | string;
  images?: string[]; // ✅ Store all images
}

const TopProducts: React.FC = () => {
  const [topProducts, setTopProducts] = useState<(Product | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mainImages, setMainImages] = useState<Record<string, string>>({});
  const router = useRouter();

  const { addToCart } = useCart(); // ✅ now inside component

  const getImage = (img?: string) => {
    if (!img) return "/product1.png"; // fallback image
    if (img.startsWith("data:")) return img;
    return img;
  };

  useEffect(() => {
    const fetchTopProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/top-products");
        if (!res.ok) throw new Error("Failed to fetch top products");
        const data: (Product | null)[] = await res.json();
        setTopProducts(data);

        // Initialize main image for each product
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

  // ✅ use context addToCart
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
  e.stopPropagation();

  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || price;
  const hasDiscount = discountPrice < price;
  const discountPercent = hasDiscount ? Math.round(((price - discountPrice) / price) * 100) : 0;

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

  return (
    <div className={styles.container}>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {topProducts.map((product, idx) => {
          if (!product) {
            return (
              <div key={idx} className={styles.card}>
                <p className={styles.empty}>Empty Slot</p>
              </div>
            );
          }

          const productId = product.id || product._id; // ✅ always use custom ID first
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
              onClick={() => router.push(`/product/${productId}`)} // ✅ route by custom ID
              style={{ cursor: "pointer" }}
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
              </div>

              <h3 className={styles.name}>{product.name}</h3>
              {product.company && (
                <p className={styles.company}>{product.company}</p>
              )}
              {product.category && (
                <p className={styles.category}>{product.category}</p>
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
      </div>
    </div>
  );
};

export default TopProducts;
