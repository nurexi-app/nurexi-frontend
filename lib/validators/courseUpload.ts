import { z } from "zod";

export const courseOverviewSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(20, "Description is required")
    .max(1000, "Description is too long"),
  dificultyLevel: z.enum(["Beginner", "Intermediate", "Advanced"]),
  expectedDuration: z.string().min(1, "Expected duration is required"),
  language: z.string().min(1, "Language is required"),
  learningOutcome: z.array(z.string()).min(1, "Learning outcome is required"),
  image: z.string().min(1, "Image is required"),
});

export type courseOverviewType = z.infer<typeof courseOverviewSchema>;
