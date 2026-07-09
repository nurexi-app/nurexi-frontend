"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Alert {
  alert_type: string;
  description: string;
  action: string;
  action_url: string;
  count: number;
}

interface PendingAlertsProps {
  alerts: Alert[];
}

const alertConfig = {
  draft_courses: {
    icon: FileText,
    bgColor: "bg-amber-50 border-l-4 border-amber-500",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  pending_reviews: {
    icon: Clock,
    bgColor: "bg-blue-50 border-l-4 border-blue-500",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
  payment_issue: {
    icon: AlertTriangle,
    bgColor: "bg-red-50 border-l-4 border-red-500",
    textColor: "text-red-700",
    iconColor: "text-red-500",
  },
  approved: {
    icon: CheckCircle,
    bgColor: "bg-green-50 border-l-4 border-green-500",
    textColor: "text-green-700",
    iconColor: "text-green-500",
  },
  empty: {
    icon: CheckCircle,
    bgColor: "bg-green-50 border-l-4 border-green-500",
    textColor: "text-green-700",
    iconColor: "text-green-500",
  },
};

export function PendingAlerts({ alerts }: PendingAlertsProps) {
  // Check if there's an empty alert
  const isEmpty = alerts.length === 1 && alerts[0]?.alert_type === "empty";

  if (isEmpty || alerts.length === 0) {
    return (
      <Card className="bg-white rounded-lg shadow-sm h-full">
        <CardHeader className="pb-2">
          <h5 className="font-medium text-sm">Pending Alerts</h5>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
            <p className="text-sm text-green-700">
              All clear! No pending alerts.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-lg shadow-sm h-full">
      <CardHeader className="pb-2">
        <h5 className="font-medium text-sm">Pending Alerts</h5>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
          const config =
            alertConfig[alert.alert_type as keyof typeof alertConfig] ||
            alertConfig.payment_issue;
          const Icon = config.icon;

          return (
            <div
              key={index}
              className={cn(
                "rounded-lg p-4 flex items-center justify-between gap-4",
                config.bgColor,
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("h-5 w-5 shrink-0", config.iconColor)} />
                <p className={cn("text-sm font-medium", config.textColor)}>
                  {alert.description}
                </p>
              </div>

              {alert.action && alert.action_url && (
                <Link href={alert.action_url}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("shrink-0 border-0 ", config.textColor)}
                  >
                    {alert.action}
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
