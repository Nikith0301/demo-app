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

  const order = await prisma.order.create({
    data: {
      service: body.service,
      amount: body.amount,
      status: body.status,
      customer: {
        connect: {
          id: body.customer_id,
        },
      },
    },
  });

  return Response.json(order);
}
