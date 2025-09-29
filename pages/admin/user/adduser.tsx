// import ModularForm from "@/components/forms/ModularForm";
// import { createNewUser } from "@/components/lib/api/user";
// import { log } from "console";
// import Layout from "@/components/Layout/Layout";
// // import React from "react";

// function adduser() {
//   function createUser(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();
//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const admin = !!formObj?.admin ? true : false;

//     if (formObj.password != formObj.confirmPassword) {
//       //TODO tost
//       alert("passwords don't match");
//       return;
//     }

//     createNewUser(
//       formObj.name as string,
//       formObj.email as string,
//       formObj.password as string,
//       admin
//     );
//   }

//   const inputs = [
//     {
//       name: "name",
//       type: "text",
//       required: true,
//       placeholder: "Jai Prakesh",
//       label: "Name",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "email",
//       type: "email",
//       required: true,
//       placeholder: "Jai@gmail.com",
//       label: "Email",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "password",
//       type: "password",
//       required: true,
//       placeholder: "XXXXXXXXX",
//       label: "Password",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "confirmPassword",
//       type: "password",
//       required: true,
//       placeholder: "XXXXXXXXX",
//       label: "Confrim Password",
//       maxLength: 300,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "admin",
//       type: "checkbox",
//       required: false,
//       placeholder: "XXXXXXXXX",
//       label: "isAdmin",
//       maxLength: 1,
//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create User"
//         inputs={inputs}
//         submitButtonText="Create User"
//         submitHandler={createUser}
//       />
//     </Layout>
//   );
// }

// export default adduser;
