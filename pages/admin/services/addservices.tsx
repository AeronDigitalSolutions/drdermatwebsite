// import ModularForm from "@/components/forms/ModularForm";
// import Layout from "@/components/Layout/Layout";
// import { createNewService } from "@/components/lib/api/services";
// import { useSession } from "next-auth/react";
// import React from "react";

// function addservices() {
//   const session = useSession();
//   async function createservices(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const user: any = session.data?.user;

//     const res = await createNewService(
//       formObj.service as string,
//       parseInt(formObj.price as string),
//       formObj.description as string,
//       user?.token as string
//     );

//     if (res.success) {
//       console.log("New Service Created", formObj);
//       return;
//     }
//     console.log("Failed :", res.message);
//   }

//   const inputs = [
//     {
//       name: "service",
//       type: "text",
//       required: true,
//       placeholder: "Name",
//       label: "Name",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "price",
//       type: "number",
//       required: true,
//       placeholder: "Price",
//       label: "Service Price",
//       maxLength: 10,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "description",
//       type: "text",
//       required: true,
//       placeholder: "describe the service",
//       label: "Description",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create Service"
//         inputs={inputs}
//         submitButtonText="Create Service"
//         submitHandler={createservices}
//       />
//     </Layout>
//   );
// }

// export default addservices;
