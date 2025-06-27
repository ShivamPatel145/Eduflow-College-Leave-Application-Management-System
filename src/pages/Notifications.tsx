import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, Clock, X } from "lucide-react";
import { useState } from "react";
import { useNotification } from "@/context/NotificationContext";
import { motion } from "framer-motion";
import { pageFade, cardMotion, buttonMotion } from "@/lib/motion";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications 
  } = useNotification();
  
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    applicationUpdates: true,
    systemAnnouncements: true,
    reminders: true
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: value
    });
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <Bell className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <motion.div className="animate-in max-w-4xl mx-auto bg-gray-50 dark:bg-zinc-900 min-h-screen" {...pageFade}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
          <p className="text-muted-foreground dark:text-gray-300">
            {unreadCount === 0 
              ? "You're all caught up!" 
              : `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" onClick={clearAllNotifications}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {notifications.length === 0 ? (
            <Card className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Bell className="h-12 w-12 text-muted-foreground dark:text-gray-400 mb-4" />
                <p className="text-muted-foreground dark:text-gray-400 text-center">
                  No notifications to display
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400 text-center mt-2">
                  New notifications will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <motion.div key={notification.id} className={`bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 ${!notification.read ? "border-l-4 border-l-primary dark:border-l-blue-400" : ""}`} {...cardMotion}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between border-b border-gray-100 dark:border-zinc-800">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base text-gray-900 dark:text-gray-100">{notification.title}</CardTitle>
                      <CardDescription className="text-xs dark:text-gray-400">
                        {formatDate(notification.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                  <motion.div {...buttonMotion}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-700 dark:hover:text-gray-200"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <X className="h-4 w-4 text-gray-600 dark:text-gray-400 transition-colors" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </motion.div>
                </CardHeader>
                <CardContent className="pt-6 pb-6">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                </CardContent>
                {!notification.read && (
                  <CardFooter className="pt-0">
                    <motion.div {...buttonMotion}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm h-8"
                      >
                        Mark as read
                      </Button>
                    </motion.div>
                  </CardFooter>
                )}
              </motion.div>
            ))
          )}
        </div>

        <Card className="h-fit bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">Notification Settings</CardTitle>
            <CardDescription className="dark:text-gray-400">
              Customize how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Delivery Methods</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100">
                  Email Notifications
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => handleSettingChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100">
                  Push Notifications
                </Label>
                <Switch 
                  id="push-notifications"
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => handleSettingChange('push', checked)}
                />
              </div>
            </div>

            <Separator className="bg-gray-100 dark:bg-zinc-800" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notification Types</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="application-updates"
                    checked={notificationSettings.applicationUpdates}
                    onCheckedChange={(checked) => 
                      handleSettingChange('applicationUpdates', checked === true)
                    }
                  />
                  <label
                    htmlFor="application-updates"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
                  >
                    Application status updates
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="system-announcements"
                    checked={notificationSettings.systemAnnouncements}
                    onCheckedChange={(checked) => 
                      handleSettingChange('systemAnnouncements', checked === true)
                    }
                  />
                  <label
                    htmlFor="system-announcements"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
                  >
                    System announcements
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="reminders"
                    checked={notificationSettings.reminders}
                    onCheckedChange={(checked) => 
                      handleSettingChange('reminders', checked === true)
                    }
                  />
                  <label
                    htmlFor="reminders"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100"
                  >
                    Reminders
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
};

export default Notifications;
