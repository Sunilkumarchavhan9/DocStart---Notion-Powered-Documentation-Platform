"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: Date;
  createdAt?: Date;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  project?: {
    name: string;
    slug: string;
  };
  document?: {
    title: string;
    slug: string;
  };
}

export default function Notifications() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Poll for new notifications
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        if (response.ok) {
          const data = await response.json();
          // Handle the API response structure: { notifications, unreadCount, hasMore }
          setNotifications(data.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [session?.user?.id]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return "";
      case "error":
        return "";
      case "warning":
        return "";
      case "info":
        return "";
      default:
        return "Notification";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      case "error":
        return "border-red-500 bg-red-50 dark:bg-red-900/20";
      case "warning":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "info":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "border-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {Array.isArray(notifications) && notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`max-w-sm w-full p-4 rounded-lg border-l-4 shadow-lg ${getNotificationColor(notification.type)}`}
          >
            <div className="flex items-start space-x-3">
              <div className="text-xl">{getNotificationIcon(notification.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(notification.createdAt || notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 