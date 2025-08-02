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


export async function POST(req: Request) {
  const lead=await createLead(req)
  console.log(lead)
  return NextResponse.json(lead);
}