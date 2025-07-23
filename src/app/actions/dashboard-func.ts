
"use server";

import { prisma } from "@/app/lib/prisma";

type Payload = {
  filterType: "upcoming" | "previous" | "range";
  days?: number;
  fromDate?: string;
  toDate?: string;
  sortOrder?: "asc" | "desc";
};

// 1. Total Order Count
export async function getOrderCount() {
  const count = await prisma.order.count();
  return count;
}

// 2. Lead Status Summary
export async function getOrderLead() {
  const leads = await prisma.customer.groupBy({
    by: ['lead_status'],
    _count: true,
  });

  return leads.map((l) => ({
    status: l.lead_status,
    count: l._count,
  }));
}

// 3. Total Revenue
export async function getOrderRevenue() {
  const result = await prisma.order.aggregate({
    _sum: {
      totalAmount: true,
    },
  });

  return result._sum.totalAmount || 0;
}

// 4. Completed Order Count
export async function getOrderCompleted() {
  const completed = await prisma.order.count({
    where: {
      status: "COMPLETED",
    },
  });

  return completed;
}

// 5. Total Expenses
export async function getOrderExpenses() {
  const result = await prisma.expense.aggregate({
    _sum: {
      amount: true,
    },
  });

  return result._sum.amount || 0;
}

// 6. Monthly Revenue
export async function getOrderMonthlyRevenue() {
  const result = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('month', "date") AS month,
      SUM("totalAmount") AS revenue
    FROM "Order"
    GROUP BY month
    ORDER BY month ASC;
  `;

  return result as { month: Date; revenue: number }[];
}

// 7. Top Services by Orders and Revenue
export async function getMostOrdersServices() {
  const result = await prisma.$queryRaw`
    SELECT 
      "name" AS service,
      COUNT(*) AS orders,
      SUM("totalAmount") AS revenue
    FROM "ServiceInOrder"
    GROUP BY service
    ORDER BY orders DESC;
  `;

  return result as { service: string; orders: number; revenue: number }[];
}

// 8. Order Status Overview
export async function getOrderStatusOverview() {
  const total = await prisma.order.count();

  const grouped = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  return grouped.map((entry) => ({
    status: entry.status,
    count: entry._count,
    percentage: total > 0 ? Math.round((entry._count / total) * 100) : 0,
  }));
}

export async function getOverAll(){

}