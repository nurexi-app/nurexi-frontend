"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ---- Mock data (replace with backend later) ----
const initialNotifications = [
  {
    id: 1,
    title: "New course available",
    message: "A new Pharmacology course has been added.",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
  },
  {
    id: 2,
    title: "Payment successful",
    message: "Your subscription was renewed successfully.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hrs ago
  },
  {
    id: 3,
    title: "Weekly summary",
    message: "You completed 3 quizzes this week.",
    read: true,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // yesterday
  },
  {
    id: 4,
    title: "System update",
    message: "We improved performance and fixed bugs.",
    read: true,
    createdAt: new Date("2025-01-10"),
  },
];

// ---- Helpers ----
function formatGroupLabel(date: Date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24 && now.getDate() === date.getDate())
    return `${diffHours} hours ago`;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toDateString();
}

function groupByDate(notifications: any[]) {
  return notifications.reduce((groups: any, notif) => {
    const label = formatGroupLabel(notif.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(notif);
    return groups;
  }, {});
}

// ---- Page ----
export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(initialNotifications);

  const filtered = notifications.filter((n) =>
    filter === "unread" ? !n.read : true,
  );

  const grouped = groupByDate(filtered);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => setNotifications([]);

  const markSingleAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "text-sm font-medium",
              filter === "all" ? "text-primary" : "text-muted-foreground",
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "text-sm font-medium",
              filter === "unread" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Unread
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="text-sm text-primary hover:underline"
          >
            Mark all as read
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-destructive hover:underline"
          >
            Clear all
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No notifications
          </p>
        )}

        {Object.entries(grouped).map(([label, items]: any) => (
          <div key={label} className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>

            {items.map((notif: any) => (
              <div
                key={notif.id}
                onClick={() => markSingleAsRead(notif.id)}
                className={cn(
                  "flex cursor-pointer items-start justify-between rounded-xl border p-4 transition",
                  !notif.read
                    ? "bg-primary/5 border-primary/30"
                    : "bg-background",
                )}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{notif.title}</p>
                    {!notif.read && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
