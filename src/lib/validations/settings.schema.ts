import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  contactEmail: z.string().email("Please enter a valid support email address"),
  paymentGateways: z.object({
    stripeEnabled: z.boolean().optional(),
    codEnabled: z.boolean().optional(),
  }).optional(),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
