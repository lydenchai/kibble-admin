import { z } from "zod";

export const variantSchema = z.object({
  sku: z.string().optional(),
  name: z.string().min(1, "Variant name is required"),
  price: z.number({ message: "Price must be a number" }).positive("Price must be greater than 0"),
  stock: z.number({ message: "Stock must be a number" }).int().min(0, "Stock cannot be negative"),
  attributes: z.record(z.string(), z.string()).optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product title must be at least 2 characters"),
  description: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  petType: z.enum(["dog", "cat", "bird", "fish", "small_pet", "other"], {
    message: "Please select a valid pet type",
  }),
  category: z.string().min(1, "Please select a category"),
  variants: z.array(variantSchema).min(1, "Product must have at least one variant"),
  images: z.array(z.string().url("Must be a valid image URL")).optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

export type ProductInput = z.infer<typeof productSchema>;
