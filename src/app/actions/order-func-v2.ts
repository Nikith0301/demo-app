"use server";

import { prisma } from "@/app/lib/prisma";

type Payload = {
  filterType: "upcoming" | "previous" | "range";
  days?: number;
  fromDate?: string;
  toDate?: string;
  sortOrder?: "asc" | "desc";
  name?: String;
  phone?: String;
  status?: String;
};

export async function WithDate({
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
  whereClause = { date: { gte: today, lte: future } };
} else if (filterType === "previous" && days) {
  const past = new Date();
  past.setDate(today.getDate() - days);
  whereClause = { date: { gte: past, lte: today } };
} else if (filterType === "range" && fromDate && toDate) {
  whereClause = {
    date: {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    },
  };
}

  const wdate = await prisma.order.groupBy({
    by: ["subservice"],
    _count: { subservice: true },
    _sum: { revenue: true },
    where: whereClause,
    orderBy: { _count: { subservice: "asc" } },
  });
  return wdate;
}

export async function OrderView() {
  const completed = await prisma.order.count({
    where: { status: { equals: "COMPLETED" } },
  });
  const cancelled = await prisma.order.count({
    where: { status: { equals: "CANCELLED" } },
  });
  const pending = await prisma.order.count({
    where: { status: { equals: "PENDING" } },
  });
  return { completed, cancelled, pending };
}

export async function MostOrdered() {
  const most = await prisma.order.groupBy({
    by: ["subservice"],
    _count: { subservice: true },
    _sum: { revenue: true },
    orderBy: { _count: { subservice: "asc" } },
  });
  return most;
}

//above are for dashboard

export async function AllOrders({
  filterType,
  days,
  fromDate,
  toDate,
  sortOrder = "asc",
  name,
  phone,
  status,
}: Payload) {
  const today = new Date();
  let whereClause: any = {};

  if (filterType === "upcoming" && days) {
    const future = new Date();
    future.setDate(today.getDate() + days);
    whereClause.date = { gte: today, lte: future };
  } else if (filterType === "previous" && days) {
    const past = new Date();
    past.setDate(today.getDate() - days);
    whereClause.date = { gte: past, lte: today };
  } else if (filterType === "range" && fromDate && toDate) {
    whereClause.date = {
      gte: new Date(fromDate),
      lte: new Date(toDate),
    };
  }

  if (status) {
    whereClause.status = status;
  }

  if (name || phone) {
    whereClause.lead = {};

    if (name) whereClause.lead.name = { contains: name, mode: 'insensitive' };
    if (phone) whereClause.lead.phone = { contains: phone, mode: 'insensitive' };
  }

  const allord = await prisma.order.findMany({
    where: whereClause,
    include: {
      lead: true, // optional: include lead details in result
    },
    orderBy: {
      date: sortOrder,
    },
  });

  return allord;
}

