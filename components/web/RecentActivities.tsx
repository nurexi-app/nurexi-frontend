import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";

export function RecentActivities() {
  const activities: any[] = []; // mocked empty state

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
              You haven’t started any activities yet. Once you begin practicing,
              they’ll appear here.
            </p>
            <Button size="sm">Start Practice</Button>
          </div>
        ) : (
          <div>{/* future activity list */}</div>
        )}
      </CardContent>
    </Card>
  );
}
