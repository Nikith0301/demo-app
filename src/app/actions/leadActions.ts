'use server'
import type { LeadStatus } from "@prisma/client";
import type{SourcePlatform}  from "@prisma/client"
import { prisma } from "@/app/lib/prisma"




import { revalidatePath } from 'next/cache';
import { Customer, Order } from '@prisma/client';

export async function createLead(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;

  const lead_status = formData.get("lead_status") as LeadStatus;
  const source = formData.get("source") as SourcePlatform;
  const comments = formData.get("comments") as string;

  const ordersJson = formData.get("orders") as string;
  const orders = JSON.parse(ordersJson); // You must stringify the array in the client

  const customer = await prisma.customer.create({
    data: {
      name,
      phone,
      email,
      lead_status,
      source,
      comments,
     
    },
  });

  return customer;
}

// app/actions/leadActions.ts
export async function getAllLeads() {
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        include: {
          services: {
            include: {
              subServices: true,
            },
          },
        },
      },
    },
  });

  return customers;
}





type Pagination = { page?: number; limit?: number };
type Filter = {
  phone?: string;
  id?: string;
  service?: string;
  amountRange?: { gte?: number; lte?: number };
  dateRange?: { from?: Date; to?: Date };
};

export async function getLeadById(id: string) {
  return await prisma.customer.findUnique({
    where: { id },
    include: { orders: true },
  });
}

export async function getLeadByPhone(phone: string) {
  return await prisma.customer.findUnique({
    where: { phone },
    include: { orders: true },
  });
}

export async function searchOrders(filter: Filter, pagination?: Pagination) {
  const where: any = {};

  if (filter.service) {
    where.service = { contains: filter.service, mode: 'insensitive' };
  }

  if (filter.amountRange) {
    where.amount = {};
    if (filter.amountRange.gte) where.amount.gte = filter.amountRange.gte;
    if (filter.amountRange.lte) where.amount.lte = filter.amountRange.lte;
  }

  if (filter.dateRange) {
    where.createdAt = {};
    if (filter.dateRange.from) where.createdAt.gte = filter.dateRange.from;
    if (filter.dateRange.to) where.createdAt.lte = filter.dateRange.to;
  }

  const page = pagination?.page || 1;
  const limit = pagination?.limit || 10;
  const skip = (page - 1) * limit;

  const data = await prisma.order.findMany({
    where,
    include: { customer: true },
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.order.count({ where });

  return { data, total, page, limit };
}

export async function updateLead(id: string, data: Partial<Customer>) {
  const updated = await prisma.customer.update({
    where: { id },
    data,
  });
  revalidatePath('/dashboard'); // optional: revalidate after update
  return updated;
}

export async function deleteLead(id: string) {
  const deleted = await prisma.customer.delete({
    where: { id },
  });
  revalidatePath('/dashboard');
  return deleted;
}
