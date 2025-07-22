import { prisma } from "@/app/lib/prisma";
import { equal } from "assert";
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

export async function POST(req:Request){

  // const third={equals,contains,startsWith,endswith}
  console.log('searching')
  const body = await req.json()

  let where :any={}
  // where.status='pending'
  // where.name={}
  // where.name.contains='Mo'
  // where.OR = [
  //       { name: { contains: 'Mo', mode: "insensitive" } },
  //       { email: { contains: 'sai', mode: "insensitive" } },
  //     ];
  //  where.createdAt = {};
  //  where.createdAt.gte ='2-2-34';
  //  where.createdAt.lte = '424-3-4';    

  //?for orders
  // where.service='Website'
   where.AND = [
        { amount: { lte: 1000 } },
        { service: { contains: 'Service', mode: "insensitive" } },
      ];

// const result=await prisma.customer.findMany({where,include:{orders:true}})
const result=await prisma.order.findMany({where,include:{customer:true}})
   console.log(result)

   return NextResponse.json(result)
}



