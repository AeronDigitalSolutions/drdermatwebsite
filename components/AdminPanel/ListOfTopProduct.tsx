"use client";
import { API_URL } from "@/config/api";

import React, { useEffect, useState } from "react";
// @ts-ignore
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import styles from "@/styles/Dashboard/listoftopproducts.module.css";

interface Product {
  _id: string;
  name: string;
  category?: { name: string; imageUrl: string } | null;
  company?: string;
  price?: number | string;
  discountPrice?: number | string;
  images?: string[];
}

// const API_URL =
//   process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const MAX_TOP_PRODUCTS = 17;

const ListOfTopProduct: React.FC = () => {
  const [topProducts, setTopProducts] = useState<(Product | null)[]>(
    Array(MAX_TOP_PRODUCTS).fill(null)
  );
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [mainImages, setMainImages] = useState<Record<string, string>>({});

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resAll = await fetch(`${API_URL}/products`);
        const allData: Product[] = await resAll.json();
        setAllProducts(allData);

        const resTop = await fetch(`${API_URL}/top-products`);
        const topData: (Product | null)[] = await resTop.json();

        const padded = [...topData];
        while (padded.length < MAX_TOP_PRODUCTS) padded.push(null);
        setTopProducts(padded.slice(0, MAX_TOP_PRODUCTS));

        const initial: Record<string, string> = {};
        allData.forEach((p) => {
          if (p._id && p.images?.length) initial[p._id] = p.images[0];
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

  /* ================= SAVE ================= */
  const saveTopProducts = async (products: (Product | null)[]) => {
    await fetch(`${API_URL}/top-products`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    });
  };

  /* ================= ADD ================= */
  const handleAddProduct = (product: Product) => {
    const firstEmptyIndex = topProducts.findIndex((p) => p === null);
    if (firstEmptyIndex === -1) {
      alert(`Maximum ${MAX_TOP_PRODUCTS} products allowed`);
      return;
    }

    const updated = [...topProducts];
    updated[firstEmptyIndex] = product;
    setTopProducts(updated);
    saveTopProducts(updated);

    setShowModal(false);
    setSearchTerm("");
  };

  /* ================= DELETE ================= */
  const handleDeleteProduct = (index: number) => {
    const updated = [...topProducts];
    updated[index] = null;
    setTopProducts(updated);
    saveTopProducts(updated);
  };

  /* ================= DRAG ================= */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(topProducts);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setTopProducts(items);
    saveTopProducts(items);
  };

  return (
    <div className={styles.topProductContainer}>
      <h2>Top Products (17 slots)</h2>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="topProducts" direction="horizontal">
          {(provided) => (
            <div
              className={styles.topProductGrid}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {topProducts.map((product, idx) => (
                <Draggable
                  key={idx}
                  draggableId={idx.toString()}
                  index={idx}
                >
                  {(drag) => (
                    <div
                      ref={drag.innerRef}
                      {...drag.draggableProps}
                      {...drag.dragHandleProps}
                      className={`${styles.productCard} ${
                        !product ? styles.emptyCard : ""
                      }`}
                      onClick={() => !product && setShowModal(true)}
                    >
                      {product ? (
                        <>
                          <img
                            src={
                              mainImages[product._id] ||
                              product.images?.[0] ||
                              "/fallback.png"
                            }
                            className={styles.mainImage}
                          />
                          <h3 className={styles.productName}>
                            {product.name}
                          </h3>
                          <p className={styles.productCompany}>
                            {product.company}
                          </p>
                          <p className={styles.productPrice}>
                            ₹{product.price}
                          </p>
                          <button
                            className={styles.deleteButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(idx);
                            }}
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <p>Empty Slot</p>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}

              {/* 🔥 18th TILE — SHOW MORE */}
              <div className={styles.showMoreCard}>
                <span>Explore More</span>
                <small>Frontend View</small>
              </div>

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button
        className={styles.addProductButton}
        onClick={() => setShowModal(true)}
      >
        Add Product
      </button>

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className={styles.modalProductGrid}>
              {allProducts
                .filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((product) => (
                  <div
                    key={product._id}
                    className={styles.modalProductCard}
                    onClick={() => handleAddProduct(product)}
                  >
                    <img src={product.images?.[0]} />
                    <p>{product.name}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListOfTopProduct;
