'use server'

import { prisma } from "@/app/lib/prisma";
import { recalculateOrderTotal } from "@/app/lib/recalculate";

// 🟩 GET with Pagination
export async function getPaginatedServicesInOrder(orderId: string, page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;

  const [services, totalCount] = await Promise.all([
    prisma.serviceInOrder.findMany({
      where: { orderId },
      skip,
      take: pageSize,
      include: {
        subServices: true,
      },
    }),
    prisma.serviceInOrder.count({
      where: { orderId },
    }),
  ]);

  return {
    services,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
    totalCount,
  };
}

// 🟦 POST: Create a new service + subservices
export async function createServiceInOrder(data: {
  name: string;
  orderId: string;
  subServices: { name: string; amount: number }[];
}) {
  const newService = await prisma.serviceInOrder.create({
    data: {
      name: data.name,
      order: { connect: { order_id: data.orderId } },
      totalAmount: 0, // Will be recalculated
      subServices: {
        create: data.subServices.map((sub) => ({
          name: sub.name,
          amount: sub.amount,
        })),
      },
    },
    include: { subServices: true },
  });

  const newOrderTotal = await recalculateOrderTotal(data.orderId);

  return {
    message: "Service created",
    newService,
    newOrderTotal,
  };
}

// 🟨 PATCH: Update a service's name or totalAmount (recalculates total anyway)
export async function updateServiceInOrder(serviceId: string, data: { name: string }) {
  const updated = await prisma.serviceInOrder.update({
    where: { id: serviceId },
    data: {
      name: data.name,
      // totalAmount is recalculated anyway
    },
    include: {
      order: true,
    },
  });

  const newOrderTotal = await recalculateOrderTotal(updated.order.order_id);

  return {
    message: "Service updated",
    newOrderTotal,
  };
}

// 🟥 DELETE: Delete a service and recalculate the total
export async function deleteServiceInOrder(serviceId: string) {
  const service = await prisma.serviceInOrder.findUnique({
    where: { id: serviceId },
    include: {
      order: true,
    },
  });

  if (!service) {
    return {
      error: "Service not found",
    };
  }

  await prisma.serviceInOrder.delete({
    where: { id: serviceId },
  });

  const newOrderTotal = await recalculateOrderTotal(service.order.order_id);

  return {
    message: "Service deleted",
    newOrderTotal,
  };
}
