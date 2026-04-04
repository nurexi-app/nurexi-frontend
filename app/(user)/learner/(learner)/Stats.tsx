import { Card, CardDescription } from "@/components/ui/card";
import {
  CalendarCheck,
  Activity,
  HelpCircle,
  Flame,
  TrendingUp,
  Award,
  Target,
  Zap,
} from "lucide-react";

export default function StatsGrid({ stats }: { stats: any }) {
  const statsToUse = [
    {
      label: "Weekly Practice",
      value: stats.weekly_sessions || 0,
      icon: CalendarCheck,
      color: "text-blue-500",
    },
    {
      label: "Total Attempts",
      value: stats.total_exam_attempts || 0,
      icon: Activity,
      color: "text-green-500",
    },
    {
      label: "Questions Answered",
      value: stats.total_questions_answered || 0,
      icon: HelpCircle,
      color: "text-purple-500",
    },
    {
      label: "Current Streak",
      value: `${stats.current_streak || 0} days 🔥`,
      icon: Flame,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsToUse.map(({ label, value, icon: Icon, color }, index) => (
        <Card
          key={index}
          className={`md:mt-4   ${index === 3 && "max-sm:hidden"} ${index === 2 && "max-sm:col-span-full"}`}
        >
          <CardDescription className=" h-18 md:h-22 flex items-center justify-between rounded-xl p-4">
            {/* LEFT: Text */}
            <div className="flex flex-col gap-2">
              <span className="text-sm text-[#78767D]">{label}</span>
              <h1 className="text-2xl font-medium text-black">{value}</h1>
            </div>

            {/* RIGHT: Icon */}
            <div className={color}>
              <Icon className="h-10 w-10" />
            </div>
          </CardDescription>
        </Card>
      ))}
    </div>
  );
}
