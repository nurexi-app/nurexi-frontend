import {
  CalendarCheck,
  Target,
  BarChart3,
  Trophy,
  BookOpen,
  FileQuestionMark,
  TrendingUp,
} from "lucide-react";

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

    icon: BookOpen,
  },
  {
    label: "Practice Questions",

    icon: FileQuestionMark,
  },
  {
    label: "View Progress",

    icon: TrendingUp,
  },
];
