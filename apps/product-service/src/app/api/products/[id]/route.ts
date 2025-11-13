import { NextRequest, NextResponse } from "next/server";
import { ProductUpdateSchema } from "@repo/common";
import { prisma } from "@repo/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const found = await prisma.product.findUnique({ where: { id } });
    if (!found) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(found);
  } catch {
    return NextResponse.json({ error: "Failed to read product" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const body = await request.json();
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.issues }, { status: 400 });
    }

    const data = { ...parsed.data };
    delete data.id;

    try {
      const updated = await prisma.product.update({ where: { id }, data });
      return NextResponse.json(updated);
    } catch {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    try {
      const removed = await prisma.product.delete({ where: { id } });
      return NextResponse.json(removed);
    } catch {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
