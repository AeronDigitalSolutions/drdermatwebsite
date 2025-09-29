// import ModularForm from "@/components/forms/ModularForm";
// import Layout from "@/components/Layout/Layout";
// import { createNewCategory } from "@/components/lib/api/productCategories";
// import { useSession } from "next-auth/react";
// import React from "react";

// function addcategory() {
//   const session = useSession();
//   async function createcategory(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const user: any = session.data?.user;

//     const res = await createNewCategory(
//       formObj.category as string,
//       formObj.description as string,
//       user?.token as string
//     );

//     if (res.success) {
//       console.log("New Category Created", formObj);
//       return;
//     }
//     console.log("Failed :", res.message);
//   }
//   const inputs = [
//     {
//       name: "category",
//       type: "text",
//       required: true,
//       placeholder: "Name",
//       label: "Category name",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "description",
//       type: "text",
//       required: true,
//       placeholder: "Describe this Category",
//       label: "Description",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create Category"
//         inputs={inputs}
//         submitButtonText="Create Category"
//         submitHandler={createcategory}
//       />
//     </Layout>
//   );
// }

// export default addcategory;
