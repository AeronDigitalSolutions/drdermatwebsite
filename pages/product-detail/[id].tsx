"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/ProductDetailPage/ProductDetailPage.module.css";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaStar, FaRegHeart } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";
import MobileNavbar from "@/components/Layout/MobileNavbar";
import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";

interface Review {
  _id: string;
  user: { name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  category?: string;
  company?: string;
  price?: number;
  discountPrice?: number;
  quantity?: number;
  description?: string;
  images?: string[];
  reviews?: Review[];
  averageRating?: number;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "services" | "reviews">(
    "details"
  );
  const [mainImage, setMainImage] = useState<string | null>(null);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Zoom state
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data: Product = await res.json();
        setProduct(data);
        setMainImage(data.images?.[0] || null);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmitReview = async () => {
    if (!rating || !comment.trim()) {
      alert("Please provide rating and comment");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (!res.ok) throw new Error("Failed to submit review");
      const updated = await res.json();
      setProduct(updated);
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 20 }}>Product not found</p>;

  // Zoom handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mainImage) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "200%",
    });
  };

  const handleMouseLeave = () => setZoomStyle({});

  return (
    <>
      <Topbar />
      <div className={styles.wrapper}>
        {/* ----- Product Top Section (images + details) ----- */}
        <div className={styles.topSection}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            {product.images && product.images.length > 1 && (
              <div className={styles.thumbnailList}>
                {product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${product.name}-${idx}`}
                    className={`${styles.thumbnail} ${
                      mainImage === img ? styles.activeThumb : ""
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            )}
            <div
              className={styles.mainImageWrapper}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={zoomStyle}
            >
              {mainImage ? (
                <img src={mainImage} alt={product.name} className={styles.mainImage} />
              ) : (
                <div className={styles.noImage}>No Image</div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.rightColumn}>
            <p className={styles.breadcrumb}>{product.category}</p>
            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.brand}>
              By <span>{product.company || "Unknown"}</span>
            </p>

            {/* Rating */}
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${styles.star} ${
                    product.averageRating && i < Math.round(product.averageRating)
                      ? styles.filledStar
                      : ""
                  }`}
                />
              ))}
              <span>
                {product.averageRating?.toFixed(1) || "0.0"} (
                {product.reviews?.length || 0} reviews)
              </span>
              <FaRegHeart className={styles.icon} />
              <FiShare2 className={styles.icon} />
            </div>

            {/* Price */}
            <div className={styles.priceBox}>
              {product.price && (
                <p className={styles.mrp}>
                  Discount: <span>₹{product.discountPrice}</span>
                </p>
              )}
              {product.discountPrice && (
                <p className={styles.price}>
                  Price: <span>₹{product.price}</span>{" "}
                  {product.price && product.discountPrice && (
                    <span className={styles.discount}>
                      {Math.round(
                        ((product.price - product.discountPrice) / product.price) * 100
                      )}
                      % off
                    </span>
                  )}
                </p>
              )}
              <p className={styles.tax}>Inclusive of all taxes</p>
              <p className={styles.delivery}>Delivery by 10:00 PM today</p>
              <div className={styles.memberPrice}>
                ₹
                {product.discountPrice
                  ? Math.round(product.discountPrice * 0.95)
                  : product.price}
                for Premium Member
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <div className={styles.quantity}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                  <AiOutlineMinus />
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)}>
                  <AiOutlinePlus />
                </button>
              </div>
              <button className={styles.addToCart}>Add To Cart</button>
              <button className={styles.buyNow}>Buy Now</button>
            </div>
          </div>
        </div>

        {/* ----- Tabs ----- */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "details" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "services" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("services")}
          >
            Product Information
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "reviews" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* ----- Tab Content ----- */}
        <div className={styles.tabContent}>
          {activeTab === "details" && (
            <section className={styles.detailsSection}>
              <h2 className={styles.title}>Product Details</h2>
              {product.description ? (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p>No details available.</p>
              )}
            </section>
          )}

          {activeTab === "services" && (
            <section className={styles.detailsSection}>
              <h2 className={styles.title}>Product Information</h2>
              <ul>
                <li>
                  <strong>Category:</strong> {product.category}
                </li>
                <li>
                  <strong>Company:</strong> {product.company}
                </li>
                <li>
                  <strong>Quantity in Stock:</strong> {product.quantity}
                </li>
              </ul>
            </section>
          )}

          {/* ----- Reviews Tab ----- */}
          {activeTab === "reviews" && (
            <section className={styles.reviewsSection}>
              <h2 className={styles.sectionTitle}>Customer Reviews</h2>

              {/* Reviews List */}
              {product.reviews && product.reviews.length > 0 ? (
                <div className={styles.reviewsList}>
                  {product.reviews.map((rev) => (
                    <div key={rev._id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <strong>{rev.user?.name || "Anonymous"}</strong>
                        <span className={styles.reviewDate}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${styles.star} ${
                              i < rev.rating ? styles.filledStar : ""
                            }`}
                          />
                        ))}
                      </div>
                      <p className={styles.reviewComment}>{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.noReviews}>No reviews yet.</p>
              )}

              {/* Add Review */}
              <div className={styles.addReview}>
                <h3>Write a Review</h3>
                <div className={styles.ratingInput}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className={`${styles.star} ${
                        i < rating ? styles.filledStar : ""
                      }`}
                    />
                  ))}
                </div>
                <textarea
                  className={styles.commentBox}
                  placeholder="Write your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className={styles.submitButton}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
      <MobileNavbar />
      <Footer />
    </>
  );
}
