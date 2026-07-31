import { z } from "zod";

export const variantSchema = z.object({
  sku: z.string().optional(),
  name: z.string().optional(),
  price: z.coerce.number({ message: "Price must be a number" }).min(0, "Price cannot be negative"),
  compare_at_price: z.coerce.number().optional().nullable(),
  stock: z.coerce.number({ message: "Stock must be a number" }).int().min(0, "Stock cannot be negative"),
  size: z.string().optional(),
  weight: z.string().optional(),
  flavor: z.string().optional(),
  attributes: z.record(z.string(), z.string()).optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product title must be at least 2 characters"),
  description: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  pet_type: z.string().min(1, "Please select a valid pet type"),
  category: z.string().min(1, "Please select a category"),
  variants: z.array(variantSchema).min(1, "Product must have at least one variant"),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  is_active: z.boolean().optional(),
  rating_avg: z.coerce.number().optional(),
  rating_count: z.coerce.number().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
