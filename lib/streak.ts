// Streaks use Africa/Lagos calendar days (UTC+1, no daylight saving).
const DAY_MS = 24 * 60 * 60 * 1000;
const LAGOS_OFFSET_MS = 60 * 60 * 1000;

function activityDay(date: Date): number {
  return Math.floor((date.getTime() + LAGOS_OFFSET_MS) / DAY_MS);
}

function daysSinceActivity(lastActivityDate: string | null, now: Date): number {
  if (!lastActivityDate) return Infinity;
  return activityDay(now) - activityDay(new Date(lastActivityDate));
}

export function getCurrentStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  now: Date = new Date(),
): number {
  const gap = daysSinceActivity(lastActivityDate, now);
  return gap === 0 || gap === 1 ? currentStreak : 0;
}

export function calculateNewStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  now: Date = new Date(),
): number {
  const gap = daysSinceActivity(lastActivityDate, now);
  if (gap === 0) return Math.max(1, currentStreak);
  if (gap === 1) return currentStreak + 1;
  return 1;
}

export function millisecondsUntilNextStreakDay(now: Date = new Date()): number {
  return (activityDay(now) + 1) * DAY_MS - LAGOS_OFFSET_MS - now.getTime();
}

export const STREAK_UPDATED_EVENT = "learner-streak-updated";
