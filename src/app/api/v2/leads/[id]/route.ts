import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {

    const id = params.id;

  try {
    const deletedLead = await prisma.lead.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Lead and related orders deleted", deletedLead });
  } catch (error) {
    console.error("Error deleting Lead:", error);
    return NextResponse.json({ error: "Failed to delete Lead" }, { status: 500 });
  }
}


