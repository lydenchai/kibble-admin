import { z } from "zod";

export const storeSettingsSchema = z.object({
  store_name: z.string().min(2, "Store name must be at least 2 characters"),
  contact_email: z.string().email("Please enter a valid support email address"),
  payment_gateways: z.object({
    stripe_enabled: z.boolean().optional(),
    cod_enabled: z.boolean().optional(),
  }).optional(),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
