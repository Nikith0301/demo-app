import { prisma } from "@/app/lib/prisma";
import { recalculateOrderTotal } from "@/app/lib/recalculate";




//?this is long version redundant
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const body = await req.json();

//   // 1. Update sub-service amount
//   const updatedSubService = await prisma.subServiceInOrder.update({
//     where: { id: params.id },
//     data: {
//       name: body.name,
//       amount: body.amount,
//     },
//     include: {
//       service: {
//         include: {
//           subServices: true,
//           order: {
//             include: {
//               services: {
//                 include: {
//                   subServices: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   // 2. Recalculate service total
//   const newServiceTotal = updatedSubService.service.subServices.reduce(
//     (acc, s) => acc + s.amount,
//     0
//   );

//   await prisma.serviceInOrder.update({
//     where: { id: updatedSubService.service.id },
//     data: {
//       totalAmount: newServiceTotal,
//     },
//   });

//   // 3. Recalculate order total
//   const newOrderTotal = updatedSubService.service.order.services.reduce(
//     (acc, s) =>
//       acc + s.subServices.reduce((subSum, sub) => subSum + sub.amount, 0),
//     0
//   );

//   await prisma.order.update({
//     where: { order_id: updatedSubService.service.order.order_id },
//     data: {
//       totalAmount: newOrderTotal,
//     },
//   });

//   return Response.json({ message: "Updated totals", newServiceTotal, newOrderTotal });
// }
// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const subService = await prisma.subServiceInOrder.findUnique({
//     where: { id: params.id },
//     include: {
//       service: {
//         include: {
//           subServices: true,
//           order: {
//             include: {
//               services: {
//                 include: { subServices: true },
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!subService) {
//     return new Response("Sub-service not found", { status: 404 });
//   }

//   // Delete the sub-service
//   await prisma.subServiceInOrder.delete({ where: { id: params.id } });

//   // Remove the deleted sub-service from the array
//   const remainingSubServices = subService.service.subServices.filter(
//     (s) => s.id !== subService.id
//   );

//   const newServiceTotal = remainingSubServices.reduce((acc, s) => acc + s.amount, 0);

//   const newOrderTotal = subService.service.order.services.reduce((acc, s) => {
//     const subTotal = s.id === subService.service.id
//       ? newServiceTotal
//       : s.subServices.reduce((sum, sub) => sum + sub.amount, 0);
//     return acc + subTotal;
//   }, 0);

//   await prisma.$transaction([
//     prisma.serviceInOrder.update({
//       where: { id: subService.service.id },
//       data: { totalAmount: newServiceTotal },
//     }),
//     prisma.order.update({
//       where: { order_id: subService.service.order.order_id },
//       data: { totalAmount: newOrderTotal },
//     }),
//   ]);

//   return Response.json({
//     message: "Sub-service deleted and totals updated",
//     newServiceTotal,
//     newOrderTotal,
//   });
// }



export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  const updated = await prisma.subServiceInOrder.update({
    where: { id: params.id },
    data: {
      name: body.name,
      amount: body.amount,
    },
    include: {
      service: {
        include: {
          order: true,
        },
      },
    },
  });

  const newOrderTotal = await recalculateOrderTotal(updated.service.order.order_id);

  return Response.json({
    message: "Sub-service updated",
    newOrderTotal,
  });
}



export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const sub = await prisma.subServiceInOrder.findUnique({
    where: { id: params.id },
    include: {
      service: {
        include: {
          order: true,
        },
      },
    },
  });

  if (!sub) return new Response("Not found", { status: 404 });

  await prisma.subServiceInOrder.delete({ where: { id: sub.id } });

  const newOrderTotal = await recalculateOrderTotal(sub.service.order.order_id);

  return Response.json({
    message: "Sub-service deleted",
    newOrderTotal,
  });
}
