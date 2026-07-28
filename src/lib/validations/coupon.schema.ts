import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .toUpperCase(),
  discountType: z.enum(["percentage", "fixed"], {
    message: "Please select a valid discount type",
  }),
  value: z
    .number({ message: "Discount value must be a number" })
    .positive("Discount value must be greater than 0"),
  minOrderValue: z.number().min(0, "Minimum order value cannot be negative").optional(),
  usageLimit: z.number().min(1, "Usage limit must be at least 1").nullable().optional(),
  expiryDate: z.string().min(1, "Expiry date is required"),
  is_active: z.boolean().optional(),
});

export type CouponInput = z.infer<typeof couponSchema>;
