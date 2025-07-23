// "use client";

// import { createLead } from "@/app/actions/leadActions";
// import { useState } from "react";

// export default function LeadForm() {
//   const [orders, setOrders] = useState([{ service: "Example", amount: 123 }]);

//   async function handleSubmit(formData: FormData) {
//     formData.set("orders", JSON.stringify(orders));
//     await createLead(formData);
//   }

//   return (
//     <form action={handleSubmit}>
//       <input type="text" name="name" placeholder="Name" />
//       <input type="text" name="phone" placeholder="Phone" />
//       <input type="email" name="email" placeholder="Email" />
//       <input type="text" name="lead_status" placeholder="Status" />
//       <input type="text" name="source" placeholder="Source" />
//       <textarea name="comments" placeholder="Comments" />
//       <button type="submit">Create Lead</button>
//     </form>
//   );
// }



// app/leads/page.tsx
import { getAllLeads } from "@/app/actions/leadActions";

export default async function LeadsPage() {
  const leads = await getAllLeads();
console.log(leads)
  return (
    <div>
      <h1>All Leads</h1>
      {leads.map((lead) => (
        <div key={lead.id}>{lead.name}</div>
      ))}
    </div>
  );
}
