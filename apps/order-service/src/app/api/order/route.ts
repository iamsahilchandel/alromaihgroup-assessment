import { prisma } from "@repo/db";
import { NextResponse, NextRequest } from "next/server";
import { CreateOrderSchema } from "@repo/common";
import { ZodError } from "zod";

// GET all orders with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const skip = parseInt(searchParams.get("skip") || "0");
    const take = parseInt(searchParams.get("take") || "10");
    const status = searchParams.get("status");

    // Type-safe where clause
    const orderStatusValues = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
    const where: { status?: (typeof orderStatusValues)[number] } = 
      status && orderStatusValues.includes(status as (typeof orderStatusValues)[number])
      ? { status: status as (typeof orderStatusValues)[number] }
      : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json(
      {
        data: orders,
        pagination: {
          total,
          skip,
          take,
          hasMore: skip + take < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/order error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// CREATE a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = CreateOrderSchema.parse(body);

    const order = await prisma.order.create({
      data: {
        orderNumber: validatedData.orderNumber,
        customerId: validatedData.customerId,
        subtotal: validatedData.subtotal,
        tax: validatedData.tax,
        shipping: validatedData.shipping,
        total: validatedData.total,
        shippingAddress: validatedData.shippingAddress,
        billingAddress: validatedData.billingAddress,
        notes: validatedData.notes,
        items: {
          create: validatedData.items,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        return NextResponse.json(
          { error: "Order number already exists" },
          { status: 409 }
        );
      }
    }

    console.error("POST /api/order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}