import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell, Check, Clock, X } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

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
    read: true,
    type: "warning"
  },
  {
    id: "4",
    title: "Leave Application Rejected",
    message: "Your leave application for March 15-18 has been rejected. Reason: Insufficient information provided.",
    timestamp: "2023-03-14T11:20:00Z",
    read: true,
    type: "error"
  },
  {
    id: "5",
    title: "New Announcement",
    message: "The college will be closed on May 25th for maintenance work.",
    timestamp: "2023-05-01T08:00:00Z",
    read: true,
    type: "info"
  }
];

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
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

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
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

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="animate-in max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
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
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No notifications to display
                </p>
                <p className="text-sm text-muted-foreground text-center mt-2">
                  New notifications will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={!notification.read ? "border-l-4 border-l-primary" : ""}>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <CardTitle className="text-base">{notification.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {formatDate(notification.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-sm">{notification.message}</p>
                </CardContent>
                {!notification.read && (
                  <CardFooter className="pt-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => markAsRead(notification.id)}
                      className="text-sm h-8"
                    >
                      Mark as read
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ))
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Customize how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Delivery Methods</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex items-center gap-2 cursor-pointer">
                  Email Notifications
                </Label>
                <Switch 
                  id="email-notifications" 
                  checked={notificationSettings.email}
                  onCheckedChange={(checked) => handleSettingChange('email', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center gap-2 cursor-pointer">
                  Push Notifications
                </Label>
                <Switch 
                  id="push-notifications"
                  checked={notificationSettings.push}
                  onCheckedChange={(checked) => handleSettingChange('push', checked)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Notification Types</h3>
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
    </div>
  );
};

export default Notifications;
