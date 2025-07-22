import {prisma} from "@/app/lib/prisma"

// export async function POST(req: Request) {
//   const body = await req.json();

//   const catalogEntry = await prisma.subServiceInOrder.create({
//     data: {
// service:{connect:{id:body.service_id}},
// name:body.name,
// amount:body.amount
// },
//   });

//   return Response.json(catalogEntry);
// }




export async function POST(req: Request) {
  const body = await req.json();

  const createdSubService = await prisma.subServiceInOrder.create({
    data: {
      name: body.name,
      amount: body.amount,
      service: {
        connect: { id: body.service_id }, // Ensure correct key name
      },
    },
    include: {
      service: {
        include: {
          subServices: true,
          order: {
            include: {
              services: {
                include: { subServices: true },
              },
            },
          },
        },
      },
    },
  });

  const newServiceTotal = createdSubService.service.subServices.reduce(
    (acc, s) => acc + s.amount,
    0
  );

  const newOrderTotal = createdSubService.service.order.services.reduce(
    (acc, s) =>
      acc + s.subServices.reduce((sum, sub) => sum + sub.amount, 0),
    0
  );

  await prisma.$transaction([
    prisma.serviceInOrder.update({
      where: { id: createdSubService.service.id },
      data: { totalAmount: newServiceTotal },
    }),
    prisma.order.update({
      where: { order_id: createdSubService.service.order.order_id },
      data: { totalAmount: newOrderTotal },
    }),
  ]);

  return Response.json({
    message: "Sub-service created and totals updated",
    newServiceTotal,
    newOrderTotal,
  });
}
