import { prisma } from "@/app/lib/prisma";
import { recalculateOrderTotal } from "@/app/lib/recalculate";

export async function POST(req: Request) {
  const body = await req.json();

  const newService = await prisma.serviceInOrder.create({
    data: {
      name: body.name,
      order: { connect: { order_id: body.orderId } },
      totalAmount: 0, // Will be recalculated
      subServices: {
        create: body.subServices.map((sub: any) => ({
          name: sub.name,
          amount: sub.amount,
        })),
      },
    },
    include: { subServices: true }, // optional
  });

  await recalculateOrderTotal(body.orderId);

  return Response.json(newService);
}
