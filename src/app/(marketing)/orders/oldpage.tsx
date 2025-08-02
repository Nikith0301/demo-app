"use client";

import { useState, useTransition } from "react";
import { getOrders } from "@/app/actions/orders-func";


export default function Page() {
  const [filterType, setFilterType] = useState<"upcoming" | "previous" | "range">("upcoming");
  const [days, setDays] = useState<number | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [orders, setOrders] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const fetchOrders = () => {
    startTransition(async () => {
      const result = await getOrders({
        filterType,
        days: days ? Number(days) : undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        sortOrder,
      });
      setOrders(result);
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Filter Orders</h1>

      {/* Filter Selector */}
      <div className="flex flex-wrap gap-4">
        <select
          className="border p-2 rounded"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value as any);
            setDays("");
            setFromDate("");
            setToDate("");
          }}
        >
          <option value="upcoming">Upcoming Orders (Next D Days)</option>
          <option value="previous">Previous Orders (Last D Days)</option>
          <option value="range">Between Calendar Dates</option>
        </select>

        <select
          className="border p-2 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">Sort by Date Ascending</option>
          <option value="desc">Sort by Date Descending</option>
        </select>
      </div>

      {/* Input based on filter */}
      <div className="flex gap-4">
        {filterType === "range" ? (
          <>
            <div>
              <label>From:</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label>To:</label>
              <input
                type="date"
                className="border p-2 rounded"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </>
        ) : (
          <div>
            <label>Days:</label>
            <input
              type="number"
              className="border p-2 rounded"
              value={days}
              onChange={(e) => setDays(Number(e.target.value) || "")}
            />
          </div>
        )}

        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isPending ? "Loading..." : "Get Orders"}
        </button>
      </div>

      {/* Results */}
      <div>
        <h2 className="text-lg font-semibold">Orders:</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="space-y-2">
            {orders.map((order) => (
              <li key={order.order_id} className="border p-3 rounded shadow">
                <div><strong>Order ID:</strong> {order.order_id}</div>
                <div><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</div>
                <div><strong>Status:</strong> {order.status || "Not set"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
