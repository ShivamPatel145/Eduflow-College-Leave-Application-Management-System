import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  userId?: string;
  role?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock initial notifications
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Leave Application Approved",
    message: "Your leave application for May 10-15 has been approved by the faculty.",
    timestamp: "2023-05-05T10:30:00Z",
    read: false,
    type: "success"
  },
  {
    id: "2",
    title: "Reminder: Pending HOD Approval",
    message: "Your application is waiting for HOD approval. This is a reminder.",
    timestamp: "2023-05-03T14:15:00Z",
    read: false,
    type: "info"
  },
  {
    id: "3",
    title: "Additional Information Required",
    message: "Please provide supporting documents for your leave application dated April 20-22.",
    timestamp: "2023-04-18T09:45:00Z",
    read: false,
    type: "warning"
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast for new notifications
    toast(newNotification.title, {
      description: newNotification.message,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // Persist notifications to localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('eduflow_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('eduflow_notifications', JSON.stringify(notifications));
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}; 