import { prisma } from "@/app/lib/prisma";

// export async function recalculateOrderTotal(order_id: string) {
//   const order = await prisma.order.findUnique({
//     where: { order_id },
//     include: {
//       services: {
//         include: { subServices: true },
//       },
//     },
//   });

//   const newTotal =
//     order?.services.reduce(
//       (sum, s) => sum + s.subServices.reduce((sSum, sub) => sSum + sub.amount, 0),
//       0
//     ) ?? 0;

//   await prisma.order.update({
//     where: { order_id },
//     data: { totalAmount: newTotal },
//   });

//   return newTotal;
// }


//? below is automatic in soms case seems above also should work fine

export async function recalculateOrderTotal(order_id: string) {
  const order = await prisma.order.findUnique({
    where: { order_id },
    include: {
      services: {
        include: { subServices: true },
      },
    },
  });

  let orderTotal = 0;

  // Update each service's totalAmount and calculate order total
  for (const service of order?.services || []) {
    const serviceTotal = service.subServices.reduce((s, sub) => s + sub.amount, 0);

    await prisma.serviceInOrder.update({
      where: { id: service.id },
      data: { totalAmount: serviceTotal },
    });

    orderTotal += serviceTotal;
  }

  await prisma.order.update({
    where: { order_id },
    data: { totalAmount: orderTotal },
  });

  return orderTotal;
}
