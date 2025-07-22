import { NextRequest } from "next/server";
import { prisma } from "@/app/lib/prisma"; // adjust path as needed

export async function POST(req: NextRequest) {
  try {
    const { filter = {}, sort = {}, pagination = {} } = await req.json();

    const {
      status,
      userId,
      dateFrom,
      dateTo,
      search,
    }: {
      status?: string;
      userId?: string;
      dateFrom?: string;
      dateTo?: string;
      search?: string;
    } = filter;

    const { field = "createdAt", order = "desc" } = sort;
    const { page = 1, limit = 10 } = pagination;

    const where: any = {};

    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: {
        [field]: order,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.customer.count({ where });

    return Response.json({
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching filtered customers:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
