
"use server";

import { prisma } from "@/app/lib/prisma";

type Payload = {
  filterType: "upcoming" | "previous" | "range";
  days?: number;
  fromDate?: string;
  toDate?: string;
  sortOrder?: "asc" | "desc";
};

export async function getOrders({
  filterType,
  days,
  fromDate,
  toDate,
  sortOrder = "asc",
}: Payload) {
  const today = new Date();
  let whereClause: any = {};

  if (filterType === "upcoming" && days) {
    const future = new Date();
    future.setDate(today.getDate() + days);

    whereClause = {
      date: {
        gte: today,
        lte: future,
      },
    };
  }

  if (filterType === "previous" && days) {
    const past = new Date();
    past.setDate(today.getDate() - days);

    whereClause = {
      date: {
        gte: past,
        lte: today,
      },
    };
  }

  if (filterType === "range" && fromDate && toDate) {
    whereClause = {
      date: {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      },
    };
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: {
      date: sortOrder,
    },
  });

  return orders;
}

