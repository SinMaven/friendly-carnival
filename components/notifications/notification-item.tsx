'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Target, 
  Users, 
  Award, 
  Bell,
  TrendingUp,
  Zap,
  X,
  Check
} from 'lucide-react';
import { cn, formatDistanceToNow } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { Notification } from './notification-bell';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

const notificationIcons: Record<string, React.ReactNode> = {
  first_blood: <Trophy className="h-4 w-4 text-yellow-500" />,
  challenge_solved: <Target className="h-4 w-4 text-green-500" />,
  achievement_unlocked: <Award className="h-4 w-4 text-purple-500" />,
  team_invite: <Users className="h-4 w-4 text-blue-500" />,
  team_joined: <Users className="h-4 w-4 text-blue-500" />,
  system_announcement: <Bell className="h-4 w-4 text-red-500" />,
  level_up: <TrendingUp className="h-4 w-4 text-orange-500" />,
  streak_milestone: <Zap className="h-4 w-4 text-yellow-400" />,
};

const notificationLinks: Record<string, (n: Notification) => string | undefined> = {
  first_blood: (n) => n.challenge_id ? `/dashboard/challenges/${n.challenge_id}` : undefined,
  challenge_solved: (n) => n.challenge_id ? `/dashboard/challenges/${n.challenge_id}` : undefined,
  team_invite: () => '/dashboard/team',
  team_joined: () => '/dashboard/team',
  achievement_unlocked: () => '/dashboard/profile',
};

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const icon = notificationIcons[notification.type] || <Bell className="h-4 w-4" />;
  const getLink = notificationLinks[notification.type];
  const link = getLink?.(notification);
  
  const content = (
    <div
      className={cn(
        'relative p-4 border-b transition-colors group',
        !notification.is_read && 'bg-muted/50',
        isHovered && 'bg-muted'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm', !notification.is_read && 'font-medium')}>
            {notification.title}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {formatDistanceToNow(new Date(notification.created_at))}
          </p>
        </div>
      </div>
      
      {/* Action buttons on hover */}
      <div className={cn(
        'absolute top-2 right-2 flex gap-1 transition-opacity',
        isHovered ? 'opacity-100' : 'opacity-0'
      )}>
        {!notification.is_read && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMarkAsRead();
            }}
            title="Mark as read"
          >
            <Check className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          title="Delete"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
      )}
    </div>
  );
  
  if (link) {
    return (
      <Link
        href={link}
        className="block"
        onClick={() => {
          if (!notification.is_read) {
            onMarkAsRead();
          }
        }}
      >
        {content}
      </Link>
    );
  }
  
  return content;
}
