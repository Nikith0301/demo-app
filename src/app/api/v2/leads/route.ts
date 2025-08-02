import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(){
    const leads=await prisma.lead.findMany({})

    return NextResponse.json(leads)
}

export  async function POST(req: Request) {
  const body = await req.json();

  const lead = await prisma.lead.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      address: body.address,
      pincode:body.pincode,
      lead_status: body.lead_status,
      source: body.source,
      comments: body.comments,
      orders: {
        create: body.orders, // 👈 body.orders should be an array of order objects
      },
    },
  });

  return NextResponse.json(lead)
}
