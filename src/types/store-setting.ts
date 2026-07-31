export interface StoreSettings {
  store_name?: string;
  contact_email?: string;
  contact_phone?: string;
  payment_gateways?: {
    aba_pay_enabled?: boolean;
    stripe_enabled?: boolean;
    paypal_enabled?: boolean;
    cod_enabled?: boolean;
    bank_transfer_enabled?: boolean;
  };
}
