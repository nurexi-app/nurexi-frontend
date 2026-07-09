"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Clock,
  BookOpen,
  Star,
  TrendingUp,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  activity_type: string;
  description: string;
  icon: string;
  created_at: string;
  metadata: any;
}

const iconMap: Record<string, any> = {
  "📚": BookOpen,
  "⭐": Star,
  "💰": TrendingUp,
  "✅": CheckCircle,
  "👤": UserPlus,
};

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  if (activities.length === 0) {
    return (
      <Card className="bg-white rounded-lg shadow-sm h-full">
        <CardHeader className="pb-2">
          <h5 className="font-medium text-sm">Recent Activity</h5>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">
            No recent activity yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm h-full">
      <CardHeader className="pb-2">
        <h5 className="font-medium text-sm">Recent Activity</h5>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.icon] || Clock;
          const timeAgo = formatDistanceToNow(new Date(activity.created_at), {
            addSuffix: true,
          });

          return (
            <div key={index} className="flex items-start gap-3">
              {/* Icon */}
              <div className="mt-0.5 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {timeAgo}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
