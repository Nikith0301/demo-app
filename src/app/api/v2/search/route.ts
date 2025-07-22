import { NextRequest } from "next/server";
import {prisma} from "@/app/lib/prisma"
// import {buildSubServiceFilter,buildServiceFilter,buildOrderFilter,buildCustomerFilter} from "@/app/lib/filterHelp"


export function buildCustomerFilter(filter: any) {
  const cond: any = {};
  if (filter.leadName) cond.name = { contains: filter.leadName, mode: 'insensitive' };
  if (filter.leadPhone) cond.phone = filter.leadPhone;
  if (filter.leadStatus) cond.lead_status = filter.leadStatus;
  if (filter.leadSource) cond.source = filter.leadSource;
  if (filter.leadEmail) cond.email = filter.leadEmail;
  return cond;
}

export function buildOrderFilter(filter: any) {
  const cond: any = {};
  if (filter.orderStatus) cond.status = filter.orderStatus;
  if (filter.orderAmountLt) cond.totalAmount = { lt: filter.orderAmountLt };
  return cond;
}

export function buildServiceFilter(filter: any) {
  const cond: any = {};
  if (filter.serviceName) cond.name = { contains: filter.serviceName, mode: 'insensitive' };
  if (filter.serviceAmountLt) cond.totalAmount = { lt: filter.serviceAmountLt };
  return cond;
}

export function buildSubServiceFilter(filter: any) {
  const cond: any = {};
  if (filter.amountGte) cond.amount = { gte: filter.amountGte };
  if (filter.nameContains) cond.name = { contains: filter.nameContains, mode: 'insensitive' };
  return cond;
}







export async function POST(req: NextRequest) {
  const { filter = {}, sort = {}, pagination = {} } = await req.json();
console.log(filter)
  const result = await prisma.subServiceInOrder.findMany({
    where: {
      ...buildSubServiceFilter(filter),
      service: {
        ...buildServiceFilter(filter),
        order: {
          ...buildOrderFilter(filter),
          customer: buildCustomerFilter(filter),
        },
      },
    },
    include: {
      service: {
        include: {
          order: {
            include: {
              customer: true,
            },
          },
        },
      },
    },
    orderBy: sort?.field
      ? {
          [sort.field]: sort.direction ?? 'asc',
        }
      : undefined,
    skip: pagination.skip ?? 0,
    take: pagination.limit ?? 20,
  });

  return Response.json({ result });
}
