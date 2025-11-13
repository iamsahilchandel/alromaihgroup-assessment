import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

export const CreateOrderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customerId: z.string().min(1, "Customer ID is required"),
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  subtotal: z.number().positive("Subtotal must be positive"),
  tax: z.number().nonnegative("Tax cannot be negative"),
  shipping: z.number().nonnegative("Shipping cannot be negative"),
  total: z.number().positive("Total must be positive"),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateOrderSchema = z.object({
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  shippingAddress: z.string().optional(),
  billingAddress: z.string().optional(),
  notes: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type UpdateOrder = z.infer<typeof UpdateOrderSchema>;
