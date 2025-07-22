import {prisma} from "@/app/lib/prisma"

// export async function POST(req:Request){

//     const body= await req.json()

//    const expense=await prisma.expense.create({data: body})

//    return Response.json(expense)
// }

export async function POST(req: Request) {
  const body = await req.json();

  const expense = await prisma.expense.create({
    data: {
      type: body.type,
      amount: body.amount,
      comments: body.comments,
      date: new Date(body.date),
    },
  });

  return Response.json(expense);
}
