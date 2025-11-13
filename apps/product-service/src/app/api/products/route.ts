import { NextRequest, NextResponse } from "next/server";
import { ProductCreateSchema, ProductUpdateSchema } from "@repo/common";
import { prisma } from "@repo/db";

// Product schemas are imported from `@repo/common`

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to read products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ProductCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }
    const created = await prisma.product.create({ data: parsed.data });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = ProductUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.issues },
        { status: 400 }
      );
    }
    const id = parsed.data.id ?? null;
    if (!id)
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    const data = { ...parsed.data };
    delete data.id;
    try {
      const updated = await prisma.product.update({ where: { id }, data });
      return NextResponse.json(updated);
    } catch {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing product id" },
        { status: 400 }
      );
    try {
      const removed = await prisma.product.delete({ where: { id } });
      return NextResponse.json(removed);
    } catch {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
