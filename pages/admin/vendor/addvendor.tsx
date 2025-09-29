// import ModularForm from "@/components/forms/ModularForm";
// import Layout from "@/components/Layout/Layout";
// import { createNewVendor } from "@/components/lib/api/vendor";
// import { useSession } from "next-auth/react";
// import React from "react";

// function addvendor() {
//   const session = useSession();
//   async function createvendor(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const user: any = session.data?.user;

//     const res = await createNewVendor(
//       formObj.name as string,
//       formObj.address as string,
//       formObj.head as string,
//       user?.token as string
//     );

//     if (res.success) {
//       console.log("New Vendor Created", formObj);
//       return;
//     }
//     console.log("Failed :", res.message);
//   }

//   const inputs = [
//     {
//       name: "name",
//       type: "text",
//       required: true,
//       placeholder: "Vendor's Name",
//       label: "Vendor",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "address",
//       type: "text",
//       required: true,
//       placeholder: "Vendor's Address",
//       label: "Address",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "head",
//       type: "text",
//       required: true,
//       placeholder: "Head's Name",
//       label: "Head",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create Vendor"
//         inputs={inputs}
//         submitButtonText="Create Vendor"
//         submitHandler={createvendor}
//       />
//     </Layout>
//   );
// }

// export default addvendor;
