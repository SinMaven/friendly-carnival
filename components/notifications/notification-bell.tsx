'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getNotifications } from '@/features/notifications/queries/get-notifications';
import { markNotificationsAsRead } from '@/features/notifications/actions/mark-read';
import { deleteNotification } from '@/features/notifications/actions/delete-notification';
import { NotificationItem } from './notification-item';
import { toast } from 'sonner';

export type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  challenge_id?: string;
  team_id?: string;
  actor_id?: string;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  priority: number;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const loadNotifications = useCallback(async (reset = false) => {
    const newOffset = reset ? 0 : offset;
    const result = await getNotifications({ 
      limit: 20, 
      offset: newOffset 
    });
    
    if (reset) {
      setNotifications(result.notifications);
    } else {
      setNotifications(prev => [...prev, ...result.notifications]);
    }
    
    setUnreadCount(result.unreadCount);
    setHasMore(result.hasMore);
    setOffset(newOffset + result.notifications.length);
    setIsLoading(false);
  }, [offset]);

  // Initial load
  useEffect(() => {
    loadNotifications(true);
  }, []);

  // Refresh when opened
  useEffect(() => {
    if (open) {
      loadNotifications(true);
    }
  }, [open]);

  const handleMarkAsRead = async (notificationId?: string) => {
    const result = await markNotificationsAsRead(
      notificationId ? [notificationId] : undefined
    );
    
    if (result.success) {
      if (notificationId) {
        setNotifications(prev =>
          prev.map(n =>
            n.id === notificationId ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
        );
        setUnreadCount(0);
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (notificationId: string) => {
    const result = await deleteNotification(notificationId);
    
    if (result.success) {
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      const deleted = notifications.find(n => n.id === notificationId);
      if (deleted && !deleted.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } else {
      toast.error(result.message);
    }
  };

  const handleLoadMore = () => {
    loadNotifications(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkAsRead()}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification.id)}
                  onDelete={() => handleDelete(notification.id)}
                />
              ))}
              
              {hasMore && (
                <div className="p-2 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLoadMore}
                  >
                    Load more
                  </Button>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
