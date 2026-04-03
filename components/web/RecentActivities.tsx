import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, FileQuestion, ShoppingBag, Award, Clock } from "lucide-react";

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  created_at: string;
  metadata?: any;
}

export function RecentActivities({
  activities = [],
}: {
  activities: Activity[];
}) {
  const getIcon = (type: string) => {
    switch (type) {
      case "exam":
        return FileQuestion;
      case "purchase":
        return ShoppingBag;
      case "achievement":
        return Award;
      default:
        return FileQuestion;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "exam":
        return "text-blue-500 bg-blue-50";
      case "purchase":
        return "text-green-500 bg-green-50";
      case "achievement":
        return "text-amber-500 bg-amber-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
            <Inbox className="text-muted-foreground" size={32} />
            <p className="text-sm text-muted-foreground max-w-xs">
              You haven't started any activities yet. Once you begin practicing,
              they'll appear here.
            </p>
            <Button size="sm">Start Practice</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = getIcon(activity.type);
              const iconColor = getIconColor(activity.type);

              return (
                <div className="h-fit! max-h-[50dvh] overflow-y-auto">
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    {/* Icon */}
                    <div
                      className={`rounded-lg bg-primary/10 p-2  ${iconColor}`}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.description}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Clock size={12} />
                      {formatTime(activity.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
