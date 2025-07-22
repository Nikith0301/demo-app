import { getSingleLead } from "@/prisma-db";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const customer = await getSingleLead(params.id);

    if (!customer) {
      return new NextResponse("Customer not found", { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("API error in GET /api/customers/[id]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Extract data from the request body
  const dataToUpdate = await request.json();
  console.log("bodyy is ", dataToUpdate);

  const id = await params.id;
  console.log("THE idddddddddd is", id);

//  if (dataToUpdate.orders) {//?use this when orders is not in correct format
//     dataToUpdate.orders = {
//       update: dataToUpdate.orders.map((order: any) => ({
//         where: { order_id: order.order_id },
//         data: {
//           service: order.service,
//           amount: order.amount,
//           status: order.status,
//         },
//       })),
//     };
//   }
  // 3. Use Prisma Client to update the record
  try {
    const updatedResource = await prisma.customer.update({
      where: { id: id },
      data: dataToUpdate,
    });
    return NextResponse.json(updatedResource);
  } catch (error) {
    // Handle errors, e.g., record not found, validation errors
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const deletedCustomer = await prisma.customer.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Customer and related orders deleted", deletedCustomer });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
