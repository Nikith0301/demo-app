import { prisma } from "@/app/lib/prisma"



export async function GET(){
    const orders=await prisma.order.findMany({
        include:{
            customer:true,
        },
    })

    return Response.json(orders);
}


export async function POST(req: Request) {
  const body = await req.json();

  // Compute totalAmount dynamically
  const servicesData = body.services.map((service: any) => {
    const total = service.subServices.reduce((acc: number, sub: any) => acc + sub.amount, 0);
    return {
      name: service.name,
      totalAmount: total,
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
