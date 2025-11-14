import { motion, AnimatePresence } from "motion/react";
import { Zap, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface XPNotification {
  id: string;
  amount: number;
  message: string;
  timestamp: number;
}

interface FloatingXPNotificationProps {
  notifications: XPNotification[];
  onRemove: (id: string) => void;
}

export function FloatingXPNotification({
  notifications,
  onRemove,
}: FloatingXPNotificationProps) {
  return (
    <div className="fixed top-20 right-24 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <XPNotificationItem
            key={notification.id}
            notification={notification}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function XPNotificationItem({
  notification,
  index,
  onRemove,
}: {
  notification: XPNotification;
  index: number;
  onRemove: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(notification.id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="pointer-events-auto"
      style={{ marginTop: index * 8 }}
    >
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-2xl border border-purple-300">
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <Zap className="w-5 h-5 text-white" fill="white" />
        </motion.div>
        
        <div className="flex-1">
          <div className="text-white/90 text-sm">{notification.message}</div>
          <div className="flex items-center gap-1 text-white">
            <TrendingUp className="w-4 h-4" />
            <span className="text-lg">+{notification.amount} XP</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Hook to manage XP notifications
export function useXPNotifications() {
  const [notifications, setNotifications] = useState<XPNotification[]>([]);

  const addNotification = (amount: number, message: string) => {
    const newNotification: XPNotification = {
      id: Date.now().toString() + Math.random(),
      amount,
      message,
      timestamp: Date.now(),
    };

    setNotifications((prev) => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}
