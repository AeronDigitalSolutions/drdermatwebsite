// import React, { useState } from "react";
// import styles from "@/styles/productListing.module.css";
// // import { productsCardListData } from "@/data/productsCardListData";
// import SideCategories from "@/components/Layout/SideCategories";
// import Topbar from "@/components/Layout/Topbar";
// import SearchBar from "@/components/Layout/SearchBar";
// import PrdCardListPg from "@/components/productPageComps/PrdCardListPg";

// const categoriess = [
//   { image: "/doctor1.jpg", label: "General Physician" },
//   { image: "/doctor1.jpg", label: "Ear, Nose, Throat" },
//   { image: "/doctor1.jpg", label: "Skin & Hair" },
//   { image: "/doctor1.jpg", label: "Mental Wellness" },
//   { image: "/doctor1.jpg", label: "Women’s Health" },
//   { image: "/doctor1.jpg", label: "Dental Care" },
// ];

// const ProductsPage: React.FC = () => {

//   const [currentPage, setCurrentPage] = useState(1);
//   const productsPerPage = 12;
//   const totalPages = 20;

//   // Get the current page products
//   const startIndex = (currentPage-1)*productsPerPage;
//   const endIndex = startIndex+productsPerPage;
//   // const currentProducts = productsCardListData.slice(startIndex, endIndex);

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   return (
//     <>
//     <Topbar/>

//     <div>
//     <SearchBar />
//     </div>

//     <div >
//       <section className={styles.productListing}>
//         <aside className={styles.sidebar}>
//           <SideCategories categories={categoriess} />
//         </aside>
//         <div className={styles.productsContainer}>
//           <PrdCardListPg products = {currentProducts}/> 
//         </div>
//       </section>


//       <div className={styles.pagination}>
//           {Array.from({length:totalPages}, (_, i)=> (
//             <button
//             key = {i+1}
//             className={currentPage ===i+1 ? styles.activePAge : styles.inactivePage}
//             onClick = { ()=> handlePageChange(i+1)}
//             >
//               {i+1}

//             </button>
//           ))}
//         </div>
       
//     </div>
//   </>
   
//   );
// };

// export default ProductsPage;
