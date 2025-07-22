// import { PrismaClient } from "@prisma/client";
import { prisma } from "./app/lib/prisma";
import { NextResponse } from "next/server";

export async function getAllLeads() {
   
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          include:{
            services:{
              include:{
                subServices:true
              }
            }}
        }, // optional: include related order details
        
      },
    });

    return customers;
  

}

export async function createLead(req: Request) {
  const body = await req.json();

  console.log("#### --prisma-db--####");
  console.log(body);

  const customer = await prisma.customer.create({
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
      
      lead_status: body.lead_status,
      source: body.source,
      comments: body.comments,
      orders: {
        create: body.orders, // 👈 body.orders should be an array of order objects
      },
    },
  });
2
  return customer
//   return NextResponse.json(customer);
}


// src/prisma-db.ts
export async function getSingleLead(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: true },
    });

    return customer; // return null if not found
  } catch (error) {
    console.error("DB error in getSingleLead:", error);
    throw error;
  }
}
