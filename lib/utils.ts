import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem } from "./types/cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);

export const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((unit) => String(unit).padStart(2, "0"))
    .join(":");
};

export function calculateNewStreak(
  currentStreak: number,
  lastActivityDate: string | null,
  today: Date = new Date(),
): number {
  if (!lastActivityDate) {
    return 1;
  }

  const lastDate = new Date(lastActivityDate);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if last exam was yesterday
  if (lastDate.toDateString() === yesterday.toDateString()) {
    return currentStreak + 1;
  }

  if (lastDate.toDateString() === today.toDateString()) {
    return currentStreak;
  }

  return 1;
}

export function handleSearchParamsChange(
  searchParams: URLSearchParams,
  key: string,
  value: string,
) {
  const params = new URLSearchParams(searchParams);
  params.set(key, value);
  return params.toString();
}

// Save cart to localStorage
export const saveCartToLocalStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(items));
};

// Load cart from localStorage
export const loadCartFromLocalStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("cart");
  return stored ? JSON.parse(stored) : [];
};
