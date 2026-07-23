"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountTimerProps {
  expiryDate: string;
  className?: string;
}

export function DiscountTimer({ expiryDate, className }: DiscountTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setIsExpired(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  if (isExpired) {
    return (
      <span className={cn("text-xs text-muted-foreground", className)}>
        Expired
      </span>
    );
  }

  const { days, hours, minutes, seconds } = timeLeft;

  // Only show days if more than 24 hours
  if (days > 0) {
    return (
      <span
        className={cn(
          "text-xs font-medium text-amber-600 flex items-center gap-1",
          className,
        )}
      >
        <Clock className="h-3 w-3" />
        {days}d {hours}h left
      </span>
    );
  }

  if (hours > 0) {
    return (
      <span
        className={cn(
          "text-xs font-medium text-amber-600 flex items-center gap-1",
          className,
        )}
      >
        <Clock className="h-3 w-3" />
        {hours}h {minutes}m left
      </span>
    );
  }

  if (minutes > 0) {
    return (
      <span
        className={cn(
          "text-xs font-medium text-red-600 flex items-center gap-1",
          className,
        )}
      >
        <Clock className="h-3 w-3" />
        {minutes}m {seconds}s left
      </span>
    );
  }

  return (
    <span
      className={cn(
        "text-xs font-medium text-red-600 flex items-center gap-1",
        className,
      )}
    >
      <Clock className="h-3 w-3" />
      {seconds}s left
    </span>
  );
}
