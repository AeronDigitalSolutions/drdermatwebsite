// import React, { useState } from "react";
// import { useRouter } from "next/router";
// // import clinics from "@/data/ClinicsData";
// import styles from "@/styles/components/VideoConsult/VideoConsult.module.css";

// const VideoConsult: React.FC = () => {
//   const router = useRouter();
//   const { name } = router.query;

//   // Find the selected clinic
//   // const selectedClinic = clinics.find((clinic) => clinic.name === name);

//   if (!selectedClinic) {
//     return <p>Clinic not found. Please go back and select a valid clinic.</p>;
//   }

//   const [selectedDate, setSelectedDate] = useState<string>("");
//   const [file, setFile] = useState<File | null>(null);

//   const handleAppointmentBook = () => {
//     if (!selectedDate || !file) {
//       alert("Please select a date and upload a file.");
//       return;
//     }
//     alert(
//       `Appointment booked with ${selectedClinic.doctorName} at ${selectedClinic.name} on ${selectedDate}.`
//     );
//   };

//   return (
//     <div className={styles.container}>
//       <h1 className={styles.heading}>Book a Video Consultation</h1>
//       <div className={styles.content}>
//         <img
//           src={selectedClinic.image}
//           alt={selectedClinic.name}
//           className={styles.image}
//         />
//         <div className={styles.details}>
//           <h2>{selectedClinic.name}</h2>
//           <p>{selectedClinic.description}</p>
//           <p>
//             <strong>Doctor:</strong> {selectedClinic.doctorName}
//           </p>
//           <p>
//             <strong>Address:</strong> {selectedClinic.address}
//           </p>
//           <div className={styles.form}>
//             <div className={styles.data_label}>
//               <label>
//                 Select Date:
//                 <input
//                   className={styles.input}
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                 />
//               </label>
//               <label>
//                 Upload Reports:
//                 <input
//                   className={styles.input}
//                   type="file"
//                   onChange={(e) => setFile(e.target.files?.[0] || null)}
//                 />
//               </label>
//             </div>
//             <button
//               onClick={handleAppointmentBook}
//               className={styles.bookButton}
//             >
//               Book Appointment
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoConsult;
