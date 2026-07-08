import { z } from "zod";
import { formatPrice } from "../utils";

export const PLATFORM_FEE_RATE = 0.15;
export const MIN_PRICE = 500;

export const courseOverviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase with hyphens only",
    ),
  description: z
    .string()
    .min(20, "Description is required")
    .max(1000, "Description is too long"),
  dificultyLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  expectedDuration: z.string().min(1, "Expected duration is required"),
  language: z.string().min(1, "Language is required"),
  learningOutcome: z.array(z.string()).min(1, "Learning outcome is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type courseOverviewType = z.infer<typeof courseOverviewSchema>;

export const pricingSchema = z
  .object({
    isFree: z.boolean().default(false),
    price: z.number().optional(),
    hasDiscount: z.boolean().default(false),
    discountType: z.enum(["percentage", "fixed"]).default("percentage"),
    discountValue: z.number().optional(),
    discountExpiry: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isFree) {
      if (!data.price || data.price < MIN_PRICE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Price must be at least ${formatPrice(MIN_PRICE)}`,
          path: ["price"],
        });
      }

      if (data.hasDiscount) {
        if (!data.discountValue || data.discountValue <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Discount value must be greater than 0",
            path: ["discountValue"],
          });
        }
        if (
          data.discountType === "percentage" &&
          data.discountValue &&
          data.discountValue >= 90
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Percentage discount must be less than 90%",
            path: ["discountValue"],
          });
        }
        if (
          data.discountType === "fixed" &&
          data.price &&
          data.discountValue &&
          data.discountValue >= data.price * PLATFORM_FEE_RATE
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Fixed discount cannot exceed the course price (You will not earn anything)",
            path: ["discountValue"],
          });
        }
      }
    }
  });

export type PricingFormValues = z.infer<typeof pricingSchema>;
