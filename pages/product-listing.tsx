"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/ProductList.module.css";
import productImg from "@/public/product1.png";
import Topbar from "@/components/Layout/Topbar";
import Footer from "@/components/Layout/Footer";
import MobileNavbar from "@/components/Layout/MobileNavbar";
import { useCart } from "@/context/CartContext";

interface Category {
  id: string;
  name: string;
  imageUrl?: string;
}

interface RawProduct {
  id: string;
  name: string;
  category: string;
  company: string;
  price: number;
  discountPrice: number;
  quantity: number;
  description: string;
  images: string[];
}

interface ProductWithCategory extends RawProduct {
  categoryObj?: Category | null;
}

const ProductListingPage: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useCart();

  const getImage = (img?: string) => {
    if (!img) return productImg.src;
    if (img.startsWith("data:")) return img;
    if (/^[A-Za-z0-9+/=]{50,}$/.test(img)) return `data:image/jpeg;base64,${img}`;
    return img;
  };

  const normalizeProduct = (p: RawProduct, cats: Category[]): ProductWithCategory => {
    const categoryObj = cats.find((c) => c.id === p.category) || null;
    return { ...p, categoryObj };
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/products"),
      ]);

      const catData: Category[] = await catRes.json();
      const prodData: RawProduct[] = await prodRes.json();

      const normalized = prodData.map((p) => normalizeProduct(p, catData));

      setCategories(catData);
      setProducts(normalized);

      const selectedCategoryStr = localStorage.getItem("selectedCategory");
      if (selectedCategoryStr) {
        const catObj: Category = JSON.parse(selectedCategoryStr);
        setSelectedCategory(catObj);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory ? p.category === selectedCategory.id : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Topbar hideHamburgerOnMobile />
      <section className={styles.shopSection}>
        <div className={styles.layoutWrapper}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Categories</h3>
            <div
              key="all"
              className={`${styles.sidebarCard} ${selectedCategory === null ? styles.activeCategory : ""}`}
              onClick={() => setSelectedCategory(null)}
              role="button"
            >
              <img src={productImg.src} alt="All" className={styles.sidebarImage} />
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`${styles.sidebarCard} ${selectedCategory?.id === cat.id ? styles.activeCategory : ""}`}
                onClick={() => setSelectedCategory(cat)}
                role="button"
              >
                <img src={getImage(cat.imageUrl)} alt={cat.name} className={styles.sidebarImage} />
              </div>
            ))}
          </aside>

          {/* Main Products */}
          <div style={{ width: "100%" }}>
            <div className={styles.headerRow}>
              <h1 className={styles.categoryHeading}></h1>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>
            </div>

            {loading ? (
              <p style={{ padding: 20 }}>Loading products…</p>
            ) : filteredProducts.length === 0 ? (
              <p style={{ padding: 20 }}>No products found.</p>
            ) : (
              <div className={styles.productGrid}>
                {filteredProducts.map((product) => {
                  const mainImage = getImage(product.images?.[0]);
                  const price = Number(product.price) || 0;
                  const discount = Number(product.discountPrice) || 0;

                  return (
                    <div
                      key={product.id}
                      className={styles.productCard}
                      onClick={() => router.push(`/product-detail/${product.id}`)}
                      role="button"
                    >
                      <div className={styles.productItem}>
                        <img src={mainImage} alt={product.name} className={styles.productImage} />
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productSize}>{product.company}</p>

                        <div className={styles.productPriceContainer}>
                          {discount > 0 && discount < price ? (
                            <>
                              <p className={styles.productPrice}>₹{discount}</p>
                              <p className={styles.productMrp}>₹{price}</p>
                              <span className={styles.discountTag}>
                                {Math.round(((price - discount) / price) * 100)}% OFF
                              </span>
                            </>
                          ) : (
                            <p className={styles.productPrice}>₹{price}</p>
                          )}
                        </div>

                        <button
                          className={styles.productButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart({
                              id: product.id,
                              name: product.name,
                              price: product.price,
                              mrp: product.price,
                              discount: discount > 0 ? `${Math.round(((price - discount) / price) * 100)}% OFF` : undefined,
                              discountPrice: product.discountPrice,
                              company: product.company,
                              image: product.images?.[0],
                            });
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <MobileNavbar />
    </>
  );
};

export default ProductListingPage;
