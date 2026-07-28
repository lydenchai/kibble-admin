import { Toast } from './toast';

export interface NotificationContextType {
  addToast: (title: string, message: string, link?: string, type?: string, order_id?: string) => void;
  unreadCount: number;
  clearUnread: () => void;
  allNotifications: Toast[];
}
