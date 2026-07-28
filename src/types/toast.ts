export interface Toast {
  id: string;
  title: string;
  message: string;
  link?: string;
  type?: 'order' | 'general' | string;
  order_id?: string;
}
