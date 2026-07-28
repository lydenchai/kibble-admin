export interface StoreSettings {
  storeName?: string;
  contactEmail?: string;
  paymentGateways?: {
    abaPayEnabled?: boolean;
    stripeEnabled?: boolean;
    paypalEnabled?: boolean;
    codEnabled?: boolean;
    bankTransferEnabled?: boolean;
  };
}
