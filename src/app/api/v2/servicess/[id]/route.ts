import {prisma} from "@/app/lib/prisma"
import { recalculateOrderTotal } from "@/app/lib/recalculate";
// export async function PATCH(req: Request, { params }: { params: { id: string } }) {
//   const body = await req.json();

//   const updatedService = await prisma.serviceInOrder.update({
//     where: { id: params.id },
//     data: {
//       name: body.name,
//       totalAmount: body.totalAmount, // optional if subservices are updated separately
//     },
//     include: {
//       order: {
//         include: {
//           services: {
//             include: {
//               subServices: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   const newOrderTotal = updatedService.order.services.reduce((acc, s) => {
//     return acc + s.subServices.reduce((sum, sub) => sum + sub.amount, 0);
//   }, 0);

//   await prisma.order.update({
//     where: { order_id: updatedService.order.order_id },
//     data: { totalAmount: newOrderTotal },
//   });

//   return Response.json({
//     message: "Service updated and order total updated",
//     newOrderTotal,
//   });
// }


// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   const service = await prisma.serviceInOrder.findUnique({
//     where: { id: params.id },
//     include: {
//       order: {
//         include: {
//           services: {
//             include: {
//               subServices: true,
//             },
//           },
//         },
//       },
//       subServices: true,
//     },
//   });

//   if (!service) {
//     return new Response("Service not found", { status: 404 });
//   }

//   await prisma.subServiceInOrder.deleteMany({
//     where: { serviceId: service.id },
//   });

//   await prisma.serviceInOrder.delete({
//     where: { id: service.id },
//   });

//   const remainingServices = service.order.services.filter(s => s.id !== service.id);

//   const newOrderTotal = remainingServices.reduce((acc, s) => {
//     return acc + s.subServices.reduce((sum, sub) => sum + sub.amount, 0);
//   }, 0);

//   await prisma.order.update({
//     where: { order_id: service.order.order_id },
//     data: { totalAmount: newOrderTotal },
//   });

//   return Response.json({
//     message: "Service deleted and order total updated",
//     newOrderTotal,
//   });
// }




export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  const updated = await prisma.serviceInOrder.update({
    where: { id: params.id },
    data: {
      name: body.name,
      totalAmount: body.totalAmount, // optional, will be overridden anyway
    },
    include: {
      order: true,
    },
  });

  const newOrderTotal = await recalculateOrderTotal(updated.order.order_id);

  return Response.json({
    message: "Service updated",
    newOrderTotal,
  });
}




export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const service = await prisma.serviceInOrder.findUnique({
    where: { id: params.id },
    include: {
      order: true,
    },
  });

  if (!service) return new Response("Not found", { status: 404 });

  await prisma.serviceInOrder.delete({
    where: { id: params.id },
  });

  const newOrderTotal = await recalculateOrderTotal(service.order.order_id);

  return Response.json({
    message: "Service deleted",
    newOrderTotal,
  });
}
