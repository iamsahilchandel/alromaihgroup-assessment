import { z } from "zod";

export const ProductCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  sku: z.string().optional(),
  inStock: z.boolean().optional().default(true),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const ProductUpdateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  sku: z.string().optional(),
  inStock: z.boolean().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type ProductCreate = z.infer<typeof ProductCreateSchema>;
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
