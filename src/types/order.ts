import { Address } from "./address";
import { OrderItem } from "./order-item";
import { User } from "./user";
import { OrderStatus } from "./enums/order-status.enum";
import { PaymentStatus } from "./enums/payment-status.enum";

export interface Order {
  _id: string;
  user?: User;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  createdAt: string;
  items: OrderItem[];
  shipping_address: Address;
  discount: number;
  tax: number;
  shipping: number;
  sub_total: number;
  payment_method?: string;
  tracking_number?: string;
  courier?: string;
  tracking_url?: string;
  delivered_at?: string;
}
