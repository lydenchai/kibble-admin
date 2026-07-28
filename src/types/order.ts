import { Address } from "./address";
import { OrderItem } from "./order-item";
import { User } from "./user";
import { OrderStatus } from "./enums/order-status.enum";
import { PaymentStatus } from "./enums/payment-status.enum";

export interface Order {
  _id: string;
  user: User;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: Address;
  discount: number;
  tax: number;
  shipping: number;
  subtotal: number;
  paymentMethod?: string;
  trackingNumber?: string;
  courier?: string;
  trackingUrl?: string;
  deliveredAt?: string;
  totalPrice?: number;
}
