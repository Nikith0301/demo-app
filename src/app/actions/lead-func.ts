// app/actions/leadAnalytics.ts
"use server";

import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";

type DateFilter = {
  fromDate?: string; // ISO date string
  toDate?: string;   // ISO date string
};

// ✅ 1. Lead Source Summary (with optional filter)
export async function getLeadSourceSummary(filter?: DateFilter) {
  const where: any = {};

  if (filter?.fromDate || filter?.toDate) {
    where.createdAt = {};
    if (filter.fromDate) where.createdAt.gte = new Date(filter.fromDate);
    if (filter.toDate) where.createdAt.lte = new Date(filter.toDate);
  }

  const grouped = await prisma.customer.groupBy({
    by: ["source"],
    _count: true,
    where,
  });

  const result = {
    totalLeads: grouped.reduce((acc, curr) => acc + curr._count, 0),
    whatsapp: grouped.find((g) => g.source === "WATTSAPP")?._count || 0,
    callCenter: grouped.find((g) => g.source === "CALLCENTER")?._count || 0,
    business: grouped.find((g) => g.source === "B_P")?._count || 0,
    others: grouped.find((g) => g.source === "OTHER")?._count || 0,
  };

  return result;
}

// ✅ 2. Detailed Lead Summary by Date (with optional date range)
export async function getDetailedLeadSummary(filter?: DateFilter) {
  let dateFilter = Prisma.sql``;

  if (filter?.fromDate && filter?.toDate) {
    dateFilter = Prisma.sql`
      WHERE "createdAt" BETWEEN ${filter.fromDate}::timestamp AND ${filter.toDate}::timestamp
    `;
  } else if (filter?.fromDate) {
    dateFilter = Prisma.sql`
      WHERE "createdAt" >= ${filter.fromDate}::timestamp
    `;
  } else if (filter?.toDate) {
    dateFilter = Prisma.sql`
      WHERE "createdAt" <= ${filter.toDate}::timestamp
    `;
  }

  const result = await prisma.$queryRaw<
    {
      date: string;
      callcenter: number;
      business: number;
      others: number;
      whatsapp: number;
      callback: number;
      enquiry: number;
    }[]
  >(Prisma.sql`
    SELECT 
      TO_CHAR("createdAt", 'YYYY-MM-DD') AS date,
      COUNT(*) FILTER (WHERE source = 'CALLCENTER') AS callcenter,
      COUNT(*) FILTER (WHERE source = 'B_P') AS business,
      COUNT(*) FILTER (WHERE source = 'OTHER') AS others,
      COUNT(*) FILTER (WHERE source = 'WATTSAPP') AS whatsapp,
      COUNT(*) FILTER (WHERE lead_status = 'CALLBACK') AS callback,
      COUNT(*) FILTER (WHERE lead_status = 'ENQUIRY') AS enquiry
    FROM "Customer"
    ${dateFilter}
    GROUP BY date
    ORDER BY date DESC
    LIMIT 30;
  `);

  return result;
}
