// import ModularForm from "@/components/forms/ModularForm";
// import Layout from "@/components/Layout/Layout";
// import { uploadFile } from "@/components/lib/api/file";
// import { createNewProduct } from "@/components/lib/api/product";
// import { getCategoryList } from "@/components/lib/api/productCategories";
// import { useSession } from "next-auth/react";
// import React, { useEffect, useState } from "react";

// const addproducts = () => {
//   const session = useSession();

//   const [image1, setImage1] = useState();
//   const [image2, setImage2] = useState();
//   const [image3, setImage3] = useState();
//   const [loading, setLoading] = useState<boolean>(true);
//   const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
//   const [categories, setCategories] = useState<
//     { id: number; name: string; description: string }[]
//   >([]);

//   useEffect(() => {
//     setLoading(true);
//     if (session.status === "authenticated") {
//       getCategories();
//     }
//     if (session.status === "unauthenticated") {
//     }
//   }, [session, session.status]);

//   async function getCategories() {
//     const user: any = session.data?.user;

//     const tempCat = await getCategoryList();
//     // const tempCat = await getCategoryList(user?.token as string);

//     setCategories(tempCat.data);
//     console.log(tempCat.data);
//   }

//   const handleSelectChange = (e: any) => {
//     const selectedValues = Array.from(
//       e.target.selectedOptions,
//       (option: { value: number }) => option.value
//     );
//     setSelectedOptions(selectedValues);
//   };

//   async function createproducts(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const user: any = session.data?.user;

//     console.log(formObj, typeof image1, image2, image3);

//     // const file1 = await uploadFile(image1, user?.token as string);
//     // const file2 = await uploadFile(image2, user?.token as string);
//     // const file3 = await uploadFile(image3, user?.token as string);

//     const res = await createNewProduct(
//       formObj.product as string,
//       parseInt(formObj.price as string),
//       parseInt(formObj.saleprice as string),
//       formObj.description as string,
//       formObj.longdescription as string,
//       image1 as unknown as object,
//       image2 as unknown as object,
//       image3 as unknown as object,
//       selectedOptions,
//       user?.token as string
//     );

//     // if (res.success) {
//     //   console.log("New Product Created", formObj);
//     //   return;
//     // }
//     // console.log("Failed :", res.message);
//   }

//   const inputs = [
//     {
//       name: "product",
//       type: "text",
//       required: true,
//       placeholder: "Name of the Product",
//       label: "Product",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "price",
//       type: "number",
//       required: true,
//       placeholder: "Price",
//       label: "Price",
//       maxLength: 10,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "saleprice",
//       type: "number",
//       required: true,
//       placeholder: "Sale Price",
//       label: "Sale Price",
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
//       name: "longdescription",
//       type: "textarea",
//       required: true,
//       placeholder: "Long Description of the product",
//       label: "Long Description",
//       maxLength: 2000,
//       options: [],
//       multipleselect: false,
//     },

//     {
//       name: "category",
//       type: "select",
//       required: true,
//       placeholder: "Select the categories related to it",
//       label: "Select Category ",
//       maxLength: 300,
//       onChange: handleSelectChange,
//       options: categories,
//       multipleselect: true,
//     },
//     {
//       name: "image1",
//       type: "file",
//       required: true,
//       placeholder: "First Image",
//       label: "First Image",
//       maxLength: 300,
//       onChange: (e: any) => {
//         setImage1(e.target.files[0]);
//       },
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "image2",
//       type: "file",
//       required: true,
//       placeholder: "Second Image",
//       label: "Second Image",
//       maxLength: 300,
//       onChange: (e: any) => {
//         setImage2(e.target.files[0]);
//       },
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "image3",
//       type: "file",
//       required: true,
//       placeholder: "Third Image",
//       label: "Third Image",
//       maxLength: 300,
//       onChange: (e: any) => {
//         setImage3(e.target.files[0]);
//       },
//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create Product"
//         inputs={inputs}
//         submitButtonText="Create Product"
//         submitHandler={createproducts}
//       />
//     </Layout>
//   );
// };

// export default addproducts;
