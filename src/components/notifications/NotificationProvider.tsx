"use client";

import { NotificationContextType } from '@/types/notification';
import { Toast } from '@/types/toast';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { MdOutlineNotificationsActive } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [allNotifications, setAllNotifications] = useState<Toast[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const clearUnread = () => setUnreadCount(0);

  const addToast = (title: string, message: string, link?: string, type?: string, order_id?: string) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, title, message, link, type, order_id };
    
    setToasts((prev) => [...prev, newToast]);
    setAllNotifications((prev) => [newToast, ...prev].slice(0, 50)); // Keep last 50
    setUnreadCount((prev) => prev + 1);

    // Auto remove after 6 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 6000);
  };

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${API_URL}/notifications`);

    eventSource.addEventListener('new_order', (event) => {
      try {
        const data = JSON.parse(event.data);
        const orderShortId = data.order_id ? data.order_id.substring(data.order_id.length - 6).toUpperCase() : '';
        const orderLink = data.order_id ? `/orders/${data.order_id}` : '/orders';
        
        addToast(
          'New Order Placed!',
          `Order #${orderShortId} by ${data.customer} for $${data.total.toFixed(2)}`,
          orderLink,
          'order',
          data.order_id
        );
      } catch (err) {
        console.error('Failed to parse SSE data', err);
      }
    });

    eventSource.onerror = () => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('SSE notification stream disconnected. Reconnecting...');
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleToastClick = (toast: Toast) => {
    setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    if (toast.order_id) {
      router.push(`/orders/${toast.order_id}`);
    } else if (toast.link) {
      router.push(toast.link);
    } else {
      router.push('/orders');
    }
  };

  return (
    <NotificationContext.Provider value={{ addToast, unreadCount, clearUnread, allNotifications }}>
      {children}
      
      {/* react-hot-toast Toaster */}
      <Toaster 
        position="bottom-right"
        containerStyle={{
          top: 24,
          bottom: 24,
          left: 24,
          right: 24,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(16px)',
            color: '#0f172a',
            padding: '14px 18px',
            borderRadius: '14px',
            boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06)',
            fontSize: '14px',
            fontWeight: 600,
            width: '360px',
            minWidth: '360px',
            maxWidth: '360px',
            overflow: 'hidden',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* SSE Order Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => handleToastClick(toast)}
            className="bg-white border-l-4 border-brand-500 shadow-xl rounded-xl p-4 w-80 transform transition-all duration-300 ease-in-out pointer-events-auto flex items-start gap-3 cursor-pointer hover:bg-brand-50/50 group"
          >
            <div className="text-brand-500 mt-0.5 group-hover:scale-110 transition-transform">
              <MdOutlineNotificationsActive size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">{toast.title}</h4>
              <p className="text-gray-600 text-xs mt-1 leading-snug">{toast.message}</p>
              <span className="text-[10px] text-brand-600 font-bold mt-1.5 inline-block uppercase tracking-wider">
                Click to view order →
              </span>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
