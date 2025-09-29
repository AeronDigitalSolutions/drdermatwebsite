// import ModularForm from "@/components/forms/ModularForm";
// import Layout from "@/components/Layout/Layout";
// import { createNewPaymentPlan } from "@/components/lib/api/paymentplans";
// import { useSession } from "next-auth/react";
// import React from "react";

// function addpayment() {
//   const session = useSession();

//   async function createpayment(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     const form: any = event.target;
//     const formData = new FormData(form);
//     const formObj = Object.fromEntries(formData);

//     const user: any = session.data?.user;

//     const res = await createNewPaymentPlan(
//       parseInt(formObj.months as string),
//       parseInt(formObj.installment as string),
//       parseInt(formObj.total as string),
//       user.token as string
//     );

//     if (res.success) {
//       console.log("New Payment Plan Created", formObj);
//       return;
//     }
//     console.log("Failed :", res.message);
//   }

//   const inputs = [
//     {
//       name: "months",
//       type: "number",
//       required: true,
//       placeholder: "number of months",
//       label: "Time Span of Payments",
//       maxLength: 2,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "installment",
//       type: "number",
//       required: true,
//       placeholder: "Installment Amount",
//       label: "Installment Amount",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//     {
//       name: "total",
//       type: "number",
//       required: true,
//       placeholder: "Total Amount",
//       label: "Total Amount",
//       maxLength: 100,
//       options: [],
//       multipleselect: false,
//     },
//   ];

//   return (
//     <Layout>
//       <ModularForm
//         formHead="Create Payment"
//         inputs={inputs}
//         submitButtonText="Create Payment"
//         submitHandler={createpayment}
//       />
//     </Layout>
//   );
// }

// export default addpayment;
