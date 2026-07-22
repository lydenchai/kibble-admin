export interface NotificationContextType {
  addToast: (title: string, message: string) => void;
  unreadCount: number;
  clearUnread: () => void;
  allNotifications: import('./toast').Toast[];
}
