"use client";
import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/productlist.module.css";

interface Category {
  id: string; // ✅ custom category id (CAT-0001)
  name: string;
  imageUrl: string;
}

type RawProduct = {
  id: string; // ✅ custom product id (PROD-xxxx)
  name: string;
  category: string; // category.id
  company: string;
  price: number;
  discountPrice: number;
  quantity: number;
  description: string;
  images: string[];
};

interface ProductWithCategory extends RawProduct {
  categoryObj?: Category | null;
}

function ListOfProduct() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mainImages, setMainImages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const normalizeProduct = (p: RawProduct, categories: Category[]): ProductWithCategory => {
    const categoryObj = categories.find((c) => c.id === p.category) || null;
    return { ...p, categoryObj };
  };

  const fetchCategoriesAndProducts = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/products"),
      ]);

      if (!catRes.ok) throw new Error("Failed to fetch categories");
      if (!prodRes.ok) throw new Error("Failed to fetch products");

      const catData: Category[] = await catRes.json();
      const prodData: RawProduct[] = await prodRes.json();

      const normalized = prodData.map((p) => normalizeProduct(p, catData));

      setCategories(catData);
      setProducts(normalized);

      // set main images
      const initialMainImages: Record<string, string> = {};
      normalized.forEach((p) => {
        initialMainImages[p.id] =
          p.images?.[0] || "https://via.placeholder.com/200?text=No+Image";
      });
      setMainImages(initialMainImages);
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      alert("Failed to delete product.");
      console.error(error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editingProduct) return;
    const { name, value } = e.target;

    if (name === "category") {
      const selected = categories.find((c) => c.id === value) || null;
      setEditingProduct({ ...editingProduct, category: value, categoryObj: selected });
    } else {
      setEditingProduct({ ...editingProduct, [name]: value });
    }
  };

  const handleUpdateSubmit = async () => {
    if (!editingProduct) return;

    try {
      const bodyToSend = {
        name: editingProduct.name,
        company: editingProduct.company,
        category: editingProduct.category,
        price: Number(editingProduct.price),
        discountPrice: Number(editingProduct.discountPrice),
        quantity: Number(editingProduct.quantity),
        description: editingProduct.description,
        images: editingProduct.images,
      };

      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSend),
        }
      );

      if (!res.ok) throw new Error("Failed to update product.");
      const updatedRaw: RawProduct = await res.json();
      const updatedNormalized = normalizeProduct(updatedRaw, categories);

      setProducts((prev) =>
        prev.map((p) => (p.id === updatedNormalized.id ? updatedNormalized : p))
      );

      setMainImages((prev) => ({
        ...prev,
        [updatedNormalized.id]:
          updatedNormalized.images?.[0] || prev[updatedNormalized.id],
      }));

      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update product.");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Product List</h2>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <h3>Categories</h3>
          <ul>
            <li
              className={selectedCategory === "all" ? styles.active : ""}
              onClick={() => setSelectedCategory("all")}
            >
              All Products
            </li>
            {categories.map((cat) => (
              <li
                key={cat.id}
                className={selectedCategory === cat.id ? styles.active : ""}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Product Grid */}
        <main className={styles.main}>
          <input
            type="text"
            placeholder="Search by name..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.card}>
                <img
                  src={
                    mainImages[product.id] ||
                    "https://via.placeholder.com/200?text=No+Image"
                  }
                  alt={product.name}
                  className={styles.mainImage}
                />

                {product.images && product.images.length > 1 && (
                  <div className={styles.imageRow}>
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${product.name}-${idx}`}
                        className={`${styles.imageThumb} ${
                          mainImages[product.id] === img
                            ? styles.activeThumb
                            : ""
                        }`}
                        onClick={() =>
                          setMainImages((prev) => ({
                            ...prev,
                            [product.id]: img,
                          }))
                        }
                      />
                    ))}
                  </div>
                )}

                <h3 className={styles.name}>{product.name}</h3>
                <p className={styles.company}>{product.company}</p>

                <p className={styles.category}>
                  {product.categoryObj?.imageUrl && (
                    <img
                      src={product.categoryObj.imageUrl}
                      alt={product.categoryObj.name}
                      className={styles.categoryIcon}
                    />
                  )}
                  {product.categoryObj?.name || "Unknown"}
                </p>

                <div className={styles.priceRow}>
                  <span className={styles.discount}>₹{product.price}</span>
                  {product.discountPrice &&
                    product.discountPrice !== product.price && (
                      <span className={styles.original}>
                        ₹{product.discountPrice}
                      </span>
                    )}
                </div>

                <p className={styles.quantity}>Available: {product.quantity}</p>

                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />

                <div className={styles.buttonGroup}>
                  <button
                    className={styles.updateBtn}
                    onClick={() => setEditingProduct(product)}
                  >
                    Update
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Edit Product</h3>
            <input
              name="name"
              value={editingProduct.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              name="company"
              value={editingProduct.company}
              onChange={handleInputChange}
              placeholder="Company"
            />
            <select
              name="category"
              value={editingProduct.category}
              onChange={handleInputChange}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              name="price"
              value={editingProduct.price}
              onChange={handleInputChange}
              placeholder="Price"
            />
            <input
              name="discountPrice"
              value={editingProduct.discountPrice}
              onChange={handleInputChange}
              placeholder="Discount Price"
            />
            <input
              name="quantity"
              value={editingProduct.quantity}
              onChange={handleInputChange}
              placeholder="Quantity"
            />
            <textarea
              name="description"
              value={editingProduct.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows={4}
            ></textarea>

            <div className={styles.modalButtons}>
              <button onClick={handleUpdateSubmit}>Save</button>
              <button onClick={() => setEditingProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListOfProduct;
