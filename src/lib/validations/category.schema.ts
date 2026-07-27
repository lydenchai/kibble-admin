import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
  image: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
