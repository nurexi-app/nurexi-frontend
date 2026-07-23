import { formatPrice } from "@/lib/utils";
import { useMemo } from "react";

interface Discount {
  has_discount: boolean;
  discount_type: "percentage" | "fixed" | null;
  discount_value: number | null;
  discount_expiry: string | null;
}

interface PriceResult {
  originalPrice: number;
  effectivePrice: number;
  discountAmount: number;
  discountLabel: string | null;
  hasActiveDiscount: boolean;
  isExpired: boolean;
  daysRemaining: number | null;
}

export function useCoursePrice(
  price: number,
  discount?: Discount | null,
): PriceResult {
  return useMemo(() => {
    const result: PriceResult = {
      originalPrice: price,
      effectivePrice: price,
      discountAmount: 0,
      discountLabel: null,
      hasActiveDiscount: false,
      isExpired: false,
      daysRemaining: null,
    };

    if (!discount || !discount.has_discount) {
      return result;
    }

    // Check if discount has expired
    const now = new Date();
    let isExpired = false;
    let daysRemaining: number | null = null;

    if (discount.discount_expiry) {
      const expiryDate = new Date(discount.discount_expiry);
      if (expiryDate < now) {
        isExpired = true;
      } else {
        const diffTime = expiryDate.getTime() - now.getTime();
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    if (isExpired || !discount.discount_value || discount.discount_value <= 0) {
      return result;
    }

    const { discount_type, discount_value } = discount;

    let effectivePrice = price;
    let discountAmount = 0;
    let discountLabel: string | null = null;

    if (discount_type === "percentage") {
      discountAmount = (price * discount_value) / 100;
      effectivePrice = price - discountAmount;
      discountLabel = `${discount_value}% off`;
    } else if (discount_type === "fixed") {
      discountAmount = Math.min(discount_value, price);
      effectivePrice = price - discountAmount;
      discountLabel = `-${formatPrice(discount_value)}`;
    }

    return {
      ...result,
      effectivePrice: Math.max(effectivePrice, 0),
      discountAmount,
      discountLabel,
      hasActiveDiscount: effectivePrice < price && !isExpired,
      isExpired,
      daysRemaining,
    };
  }, [price, discount]);
}
