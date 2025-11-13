import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@repo/db";

const ProductUpdateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  sku: z.string().optional(),
  inStock: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

function getIdFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  return segments[segments.length - 1];
}

export async function GET(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
    if (!id) return NextResponse.json({ error: "Missing product id" }, { status: 400 });

    const found = await prisma.product.findUnique({ where: { id } });
    if (!found) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(found);
  } catch {
    return NextResponse.json({ error: "Failed to read product" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
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
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromRequest(request);
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
