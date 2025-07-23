import { prisma } from "@/app/lib/prisma"



export async function GET(){
  const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 30);

const upcomingOrders = await prisma.order.findMany({
  where: {
    date: {
      gte: today,       // Greater than or equal to today
      lte: nextWeek,    // Less than or equal to 7 days from now
    },
  },
  // include: {
  //   services: {
  //     include: {
  //       subServices: true,
  //     },
  //   },
  // },
});

    return Response.json(upcomingOrders);
}


export async function POST(req: Request) {
  const body = await req.json();

  // Compute totalAmount dynamically
  const servicesData = body.services.map((service: any) => {
    const total = service.subServices.reduce((acc: number, sub: any) => acc + sub.amount, 0);
    return {
      name: service.name,
      totalAmount: total,
      date:service.date,
      subServices: {
        create: service.subServices,
      },
    };
  });

  const totalOrderAmount = servicesData.reduce((acc: number, s: any) => acc + s.totalAmount, 0);

  const newOrder = await prisma.order.create({
    data: {
      customer: {
        connect: { id: body.customer_id },
      },
      address: body.address,
      status: body.status,
      date:body.date,
      totalAmount: totalOrderAmount,
      services: {
        create: servicesData,
      },
    },
    include: {
      services: {
        include: {
          subServices: true,
        },
      },
    },
  });

  return Response.json(newOrder);
}
