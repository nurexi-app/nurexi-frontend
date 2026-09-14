"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  getCurrentStreak,
  millisecondsUntilNextStreakDay,
  STREAK_UPDATED_EVENT,
} from "@/lib/streak";

export default function CurrentStreak({
  userId,
  initialValue = null,
  initialLastActivityDate = null,
}: {
  userId: string;
  initialValue?: number | null;
  initialLastActivityDate?: string | null;
}) {
  const pathname = usePathname();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (!userId) return;
    let disposed = false;
    let requestId = 0;
    let timer: ReturnType<typeof setTimeout>;
    let stats = initialValue === null ? null : {
      current_streak: initialValue,
      last_activity_date: initialLastActivityDate,
    };
    const supabase = createClient();

    function updateDisplay() {
      if (stats) {
        setValue(getCurrentStreak(stats.current_streak, stats.last_activity_date));
      }
      clearTimeout(timer);
      timer = setTimeout(updateDisplay, millisecondsUntilNextStreakDay() + 50);
    }

    async function refresh() {
      updateDisplay();
      const currentRequest = ++requestId;
      try {
        const { data, error } = await supabase
          .from("learner_stats")
          .select("current_streak, last_activity_date")
          .eq("user_id", userId)
          .single();
        if (disposed || currentRequest !== requestId) return;
        if (error) {
          console.error("Failed to refresh streak", error);
          return;
        }
        stats = data;
        updateDisplay();
      } catch (error) {
        if (!disposed) console.error("Failed to refresh streak", error);
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "visible") void refresh();
    }

    void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener(STREAK_UPDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      disposed = true;
      clearTimeout(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener(STREAK_UPDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [userId, pathname, initialValue, initialLastActivityDate]);

  return <>{value === null ? "—" : value} days 🔥</>;
}
