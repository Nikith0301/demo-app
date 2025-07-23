'use server'

import { prisma } from "@/app/lib/prisma"

// 🟩 GET: Fetch upcoming orders within next 30 days
export async function getUpcomingOrders() {
  const today = new Date();
  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  const upcomingOrders = await prisma.order.findMany({
    where: {
      date: {
        gte: today,
        lte: nextMonth,
      },
    },
    include: {
      services: {
        include: {
          subServices: true,
        },
      },
    },
  });

  return upcomingOrders;
}

// 🟦 POST: Create new order with services + subServices
export async function createOrder(data: {
  customer_id: string
  address: string
  status: string
  date: string
  services: {
    name: string
    date: string
    subServices: { name: string; amount: number }[]
  }[]
}) {
  const servicesData = data.services.map((service) => {
    const total = service.subServices.reduce((acc, sub) => acc + sub.amount, 0);
    return {
      name: service.name,
      date: service.date,
      totalAmount: total,
      subServices: {
        create: service.subServices,
      },
    };
  });

  const totalOrderAmount = servicesData.reduce((acc, s) => acc + s.totalAmount, 0);

  const newOrder = await prisma.order.create({
    data: {
      customer: {
        connect: { id: data.customer_id },
      },
      address: data.address,
      status: data.status as any as import("@prisma/client").OrderStatus,
      date: new Date(data.date),
      totalAmount: totalOrderAmount,
      services: {
        create: servicesData,
      },
    },
    include: {
      services: {
        include: {
          subServices: true,
        },
      },
    },
  });

  return newOrder;
}

// 🟨 PATCH: Update order by ID (only flat fields, no nested service updates here)
export async function updateOrder(order_id: string, updateData: Partial<{
  address: string
  status: string
  date: string
  totalAmount: number
}>) {
  const { status, date, ...rest } = updateData;

  const dataToUpdate: any = {
    ...rest,
  };

  if (date) {
    dataToUpdate.date = new Date(date);
  }

  if (status) {
    dataToUpdate.status = status as import("@prisma/client").OrderStatus;
  }

  const updatedOrder = await prisma.order.update({
    where: { order_id },
    data: dataToUpdate,
    include: {
      services: {
        include: { subServices: true },
      },
    },
  });

  return updatedOrder;
}

// 🟥 DELETE: Delete order by ID
export async function deleteOrder(order_id: string) {
  const deletedOrder = await prisma.order.delete({
    where: { order_id },
  });

  return deletedOrder;
}
