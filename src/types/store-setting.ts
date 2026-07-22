export interface StoreSettings {
  storeName?: string;
  contactEmail?: string;
  paymentGateways?: { stripeEnabled?: boolean; paypalEnabled?: boolean };
}
