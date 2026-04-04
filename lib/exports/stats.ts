import { Airplay } from "@/components/animate-ui/icons/airplay";
import { Binary } from "@/components/animate-ui/icons/binary";
import { ChartSpline } from "@/components/animate-ui/icons/chart-spline";
import { CalendarCheck, Target, BarChart3, Trophy } from "lucide-react";

export const stats = [
  {
    label: "Weekly Practice",
    value: "12 sessions",
    icon: CalendarCheck,
  },
  {
    label: "Accuracy Rate",
    value: "78%",
    icon: Target,
  },
  {
    label: "Total Attempts",
    value: "1,245",
    icon: BarChart3,
  },
  {
    label: "Current Streak",
    value: "6 days 🔥",
    icon: Trophy,
  },
];

export const weeklyPracticeStats = [
  {
    label: "Take Mock Exam",
    href: "/learner/exam",
    icon: Airplay,
  },
  {
    label: "Practice Questions",
    href: "/learner/practice",
    icon: Binary,
  },
  {
    label: "View Progress",
    href: "/learner/analytics",

    icon: ChartSpline,
  },
];
