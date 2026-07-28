import { Toast } from './toast';

export interface NotificationContextType {
  addToast: (title: string, message: string) => void;
  unreadCount: number;
  clearUnread: () => void;
  allNotifications: Toast[];
}
