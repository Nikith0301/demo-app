// app/api/customers/route.ts
import { prisma } from "@/app/lib/prisma";
import { createLead, getAllLeads } from "@/prisma-db";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    // const customers = await prisma.customer.findMany({include:{orders:true}});
    const leads=await getAllLeads()

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new NextResponse("Failed to fetch customers", { status: 500 });
  }
}

// export async function POST(req: Request) {
//   const body = await req.json();
//   console.log("############################")
//   console.log(body)
//   const customer = await prisma.customer.create({
//     data: {
//       name: body.name,
//       phone: body.phone,
//       email: body.email,
//       lead_status: body.lead_status,
//       source: body.source,
//       comments: body.comments,
//       orders:{
//         create:body.orders // 👈 body.orders should be an array of order objects
//       }
//     }
//   });

//   return NextResponse.json(customer);
// }

export async function POST(req: Request) {
  const lead=await createLead(req)
  console.log(lead)
  return NextResponse.json(lead);
}