"use client";

import { useState } from "react";
import { AllOrders } from "@/app/actions/order-func-v2";

export default function Page() {
  const [filterType, setFilterType] = useState<"upcoming" | "previous" | "range">("upcoming");
  const [days, setDays] = useState<number>(7);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>();

  const handleFetch = async () => {
    const payload: any = {
      filterType,
      sortOrder: "asc", // You can make this dynamic if needed
    };

    if (filterType === "upcoming" || filterType === "previous") {
      payload.days = days;
    }

    if (filterType === "range") {
      payload.fromDate = fromDate;
      payload.toDate = toDate;
    }

    if (status) payload.status = status;
    if (name) payload.name = name;
    if (phone) payload.phone = phone;

    const res = await AllOrders(payload);
    console.log(res);
    setResult(res);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Filter Orders</h2>

      <div className="space-x-4">
        <label>
          <input
            type="radio"
            name="filter"
            value="upcoming"
            checked={filterType === "upcoming"}
            onChange={() => setFilterType("upcoming")}
          />
          Upcoming
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="previous"
            checked={filterType === "previous"}
            onChange={() => setFilterType("previous")}
          />
          Previous
        </label>
        <label>
          <input
            type="radio"
            name="filter"
            value="range"
            checked={filterType === "range"}
            onChange={() => setFilterType("range")}
          />
          Range
        </label>
      </div>

      {(filterType === "upcoming" || filterType === "previous") && (
        <input
          type="number"
          placeholder="Enter number of days"
          className="border p-2"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
        />
      )}

      {filterType === "range" && (
        <div className="space-x-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2"
          />
        </div>
      )}

      <input
        type="text"
        placeholder="Filter by name"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Filter by phone"
        className="border p-2 w-full"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <select
        className="border p-2 w-full"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">-- Select Status --</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="PENDING">PENDING</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <button
        onClick={handleFetch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Fetch Orders
      </button>

      {result && (
        <pre className="bg-black-100 p-4 mt-4 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
