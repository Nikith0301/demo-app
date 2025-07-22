import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const phone = url.searchParams.get("phone");

  try {
    let customer;

    if (id) {
      customer = await prisma.customer.findUnique({
        where: { id },
        include: { orders: true },
      });
    } else if (phone) {
      customer = await prisma.customer.findUnique({
        where: { phone },
        include: { orders: true },
      });
    } else {
      return new NextResponse("Missing query param: id or phone", { status: 400 });
    }

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Search error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
