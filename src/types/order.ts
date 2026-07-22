import { Address } from "./address";
import { OrderItem } from "./order-item";
import { User } from "./user";

export interface Order {
  _id: string;
  user: User;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  discount: number;
  tax: number;
  shipping: number;
  subtotal: number;
  paymentMethod: any;
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  deliveredAt?: string;
}
