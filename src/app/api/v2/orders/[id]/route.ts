import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } } // assuming `id` is the order_id
// ) {
//   try {
//     const body = await req.json();

//     const updatedOrder = await prisma.order.update({
//       where: { orderId: params.id },
//       data: body,
//     });

//     return NextResponse.json(updatedOrder);
//   } catch (error) {
//     console.error("Update failed:", error);
//     return new NextResponse("Failed to update order", { status: 500 });
//   }
// }

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Fetch current order to get revenue if not included in PATCH
    const existingOrder = await prisma.order.findUnique({
      where: { orderId: params.id },
    });

    if (!existingOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const revenue = body.revenue ?? existingOrder.revenue;
    const vendor = body.vendor ?? existingOrder.vendor;
    if (revenue < vendor) {
      return NextResponse.json({ msg: "Profit cant be -ve" });
    }
    const profit = revenue - vendor;

    const updatedOrder = await prisma.order.update({
      where: { orderId: params.id },
      data: {
        ...body,
        profit,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {

    const orderId = params.id;

  try {
    const deletedOrder = await prisma.order.delete({
      where: { orderId },
    });
    return NextResponse.json({ message: "Lead and related orders deleted", deletedOrder });
  } catch (error) {
    console.error("Error deleting Lead:", error);
    return NextResponse.json({ error: "Failed to delete Lead" }, { status: 500 });
  }
}
