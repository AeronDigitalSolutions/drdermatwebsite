"use client";

import React, { useEffect, useState } from "react";
import styles from "@/styles/Dashboard/listoftopproducts.module.css";
// @ts-ignore
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

interface Product {
  _id: string;
  name: string;
  category?: { name: string; imageUrl: string } | null;
  company?: string;
  price?: number | string;
  discountPrice?: number | string;
  images?: string[]; // ✅ multiple images
}

const ListOfTopProduct: React.FC = () => {
  const [topProducts, setTopProducts] = useState<(Product | null)[]>(Array(8).fill(null));
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mainImages, setMainImages] = useState<Record<string, string>>({}); // ✅ store selected main image

  // Fetch products + top products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const resAll = await fetch("http://localhost:5000/api/products");
        if (!resAll.ok) throw new Error("Failed to fetch all products");
        const allData: Product[] = await resAll.json();
        setAllProducts(allData);

        const resTop = await fetch("http://localhost:5000/api/top-products");
        if (!resTop.ok) throw new Error("Failed to fetch top products");
        const topData: (Product | null)[] = await resTop.json();

        const padded = [...topData];
        while (padded.length < 8) padded.push(null);
        setTopProducts(padded);

        // ✅ set default main image for each product
        const initial: Record<string, string> = {};
        allData.forEach((p) => {
          if (p._id && p.images?.length) {
            initial[p._id] = p.images[0];
          }
        });
        setMainImages(initial);
      } catch (err: any) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save top products to backend
  const saveTopProducts = async (products: (Product | null)[]) => {
    try {
      await fetch("http://localhost:5000/api/top-products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      });
    } catch (err) {
      console.error("Failed to save top products:", err);
    }
  };

  // Add product to top
  const handleAddProduct = (product: Product) => {
    const firstEmptyIndex = topProducts.findIndex((p) => p === null);
    if (firstEmptyIndex === -1) {
      alert("Maximum 8 products allowed!");
      return;
    }
    const newTopProducts = [...topProducts];
    newTopProducts[firstEmptyIndex] = product;
    setTopProducts(newTopProducts);
    saveTopProducts(newTopProducts);

    // ✅ initialize main image if not already set
    if (product._id && product.images?.length) {
      setMainImages((prev) => ({ ...prev, [product._id]: product.images![0] }));
    }

    setShowModal(false);
    setSearchTerm("");
  };

  // Delete product from top
  const handleDeleteProduct = (index: number) => {
    const newTopProducts = [...topProducts];
    newTopProducts[index] = null;
    setTopProducts(newTopProducts);
    saveTopProducts(newTopProducts);
  };

  // Drag & drop reorder
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(topProducts);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTopProducts(items);
    saveTopProducts(items);
  };

  return (
    <div className={styles.topProductContainer}>
      <h2>Top Products</h2>

      {/* Drag & Drop Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="topProducts" direction="horizontal">
          {(provided) => (
            <div
              className={styles.topProductGrid}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {topProducts.map((product, idx) => (
                <Draggable key={idx} draggableId={idx.toString()} index={idx}>
                  {(providedDraggable) => (
                    <div
                      ref={providedDraggable.innerRef}
                      {...providedDraggable.draggableProps}
                      {...providedDraggable.dragHandleProps}
                      className={`${styles.productCard} ${!product ? styles.emptyCard : ""}`}
                      onClick={() => !product && setShowModal(true)}
                    >
                      {product ? (
                        <div className={styles.productItem}>
                          {/* ✅ Main image */}
                          <img
                            src={
                              mainImages[product._id] ||
                              product.images?.[0] ||
                              "/fallback.png"
                            }
                            alt={product.name}
                            className={styles.mainImage}
                          />

                          {/* ✅ Thumbnails */}
                          {product.images && product.images.length > 1 && (
                            <div className={styles.imageRow}>
                              {product.images.slice(0, 4).map((img, i) => (
                                <img
                                  key={i}
                                  src={img}
                                  alt={`${product.name}-thumb-${i}`}
                                  className={`${styles.imageThumb} ${
                                    mainImages[product._id] === img
                                      ? styles.activeThumb
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMainImages((prev) => ({
                                      ...prev,
                                      [product._id]: img,
                                    }));
                                  }}
                                />
                              ))}
                            </div>
                          )}

                          <h3 className={styles.productName}>{product.name}</h3>
                          <p className={styles.productCompany}>{product.company}</p>
                          <p className={styles.productPrice}>₹{product.price}</p>
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(idx);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <p>Empty Slot</p>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button className={styles.addProductButton} onClick={() => setShowModal(true)}>
        Add Product
      </button>

      {/* Modal with all products */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Select a Product</h3>

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : allProducts.length === 0 ? (
              <p>No products available</p>
            ) : (
              <div className={styles.modalProductGrid}>
                {allProducts
                  .filter((product) =>
                    product.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      className={styles.modalProductCard}
                      onClick={() => handleAddProduct(product)}
                    >
                      <img
                        src={product.images?.[0] || "/fallback.png"}
                        alt={product.name}
                        className={styles.modalProductImage}
                      />
                      <p>{product.name}</p>
                    </div>
                  ))}
              </div>
            )}
            <button className={styles.closeModalButton} onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfTopProduct;
