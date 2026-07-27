"use client";

import { NotificationContextType } from '@/types/notificaton';
import { Toast } from '@/types/toast';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MdOutlineNotificationsActive } from 'react-icons/md';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [allNotifications, setAllNotifications] = useState<Toast[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const clearUnread = () => setUnreadCount(0);

  const addToast = (title: string, message: string) => {
    const id = Date.now().toString();
    const newToast = { id, title, message };
    
    setToasts((prev) => [...prev, newToast]);
    setAllNotifications((prev) => [newToast, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount((prev) => prev + 1);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${API_URL}/notifications`);

    eventSource.addEventListener('new_order', (event) => {
      try {
        const data = JSON.parse(event.data);
        addToast('New Order Placed!', `Order #${data.orderId.substring(data.orderId.length - 6).toUpperCase()} by ${data.customer} for $${data.total.toFixed(2)}`);
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    });

    eventSource.onerror = () => {
      // EventSource natively auto-reconnects on disconnection.
      // Avoid calling eventSource.close() here so it can automatically reconnect when backend is available.
      if (process.env.NODE_ENV === 'development') {
        console.warn('SSE notification stream disconnected. Reconnecting...');
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ addToast, unreadCount, clearUnread, allNotifications }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-white border-l-4 border-brand-500 shadow-lg rounded p-4 w-80 transform transition-all duration-300 ease-in-out pointer-events-auto flex items-start gap-3"
          >
            <div className="text-brand-500 mt-0.5">
              <MdOutlineNotificationsActive size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{toast.title}</h4>
              <p className="text-gray-600 text-sm mt-1">{toast.message}</p>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
