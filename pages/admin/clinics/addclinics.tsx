// import ModularForm from "@/components/forms/ModularForm";
// import Layout from "@/components/Layout/Layout";
// import { createNewClinic } from "@/components/lib/api/clinics";
// import { useSession } from "next-auth/react";
// import React from "react";

// const addclinics = () => {
//   const session = useSession();
//   async function createproducts(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const user: any = session.data?.user;

//     const res = await createNewClinic(
//       formObj.name as string,
//       formObj.latitude as string,
//       formObj.longitude as string,
//       formObj.description as string,
//       formObj.address as string,
//       user?.token as string
//     );

//     if (res.success) {
//       console.log("New Product Created", formObj);
//       return;
//     }
//     console.log("Failed :", res.message);
//   }

//   const inputs = [
//     {
//       name: "name",
//       type: "text",
//       required: true,
//       placeholder: "Name of the Clinic",
//       label: "Name",
//       maxLength: 100,

//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "latitude",
//       type: "string",
//       required: true,
//       placeholder: "Latitude",
//       label: "Latitude",
//       maxLength: 10,

//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "longitude",
//       type: "string",
//       required: true,
//       placeholder: "Longitude",
//       label: "Longitude",
//       maxLength: 10,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "description",
//       type: "textarea",
//       required: true,
//       placeholder: "Description of the product",
//       label: "Description",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "address",
//       type: "textarea",
//       required: true,
//       placeholder: "Address",
//       label: "Address",
//       maxLength: 300,

//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create Product"
//         inputs={inputs}
//         submitButtonText="Create Clinic"
//         submitHandler={createproducts}
//       />
//     </Layout>
//   );
// };

// export default addclinics;
