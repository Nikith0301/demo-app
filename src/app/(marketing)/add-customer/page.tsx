// app/add-customer/page.tsx
"use client";

import { useState } from "react";

export default function AddCustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    lead_status: "ENQUIRY",
    source: "OTHER",
    comments: "",
    order_id: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    alert("Customer added: " + data.name);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4 max-w-lg">
      <input name="name" onChange={handleChange} placeholder="Name" className="w-full border p-2" />
      <input name="phone" onChange={handleChange} placeholder="Phone" className="w-full border p-2" />
      <input name="email" onChange={handleChange} placeholder="Email" className="w-full border p-2" />
      <select name="lead_status" onChange={handleChange} className="w-full border p-2">
        <option value="INVALID">INVALID</option>
        <option value="VALID">VALID</option>
        <option value="CALLBACK">CALLBACK</option>
        <option value="ENQUIRY">ENQUIRY</option>
      </select>
      <select name="source" onChange={handleChange} className="w-full border p-2">
        <option value="WATTSAPP">WhatsApp</option>
        <option value="B_P">B_P</option>
        <option value="CALLCENTER">Call Center</option>
        <option value="OTHER">Other</option>
      </select>
      <input name="order_id" onChange={handleChange} placeholder="Order ID" className="w-full border p-2" />
      {/* <textarea name="comments" onChange={handleChange} placeholder="Comments" className="w-full border p-2" /> */}
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Customer</button>
    </form>
  );
}
