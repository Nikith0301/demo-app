"use server";

import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

export async function LeadSummary(){

    
    const r1=await prisma.lead.groupBy({by:['source','createdAt'],_count:{source:true}})

    return r1

}