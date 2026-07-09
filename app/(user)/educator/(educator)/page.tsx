import { PendingAlerts } from "@/components/user/educator/dashboard/PendingAlerts";
import QuickActions from "@/components/user/educator/dashboard/QuickActions";
import { RecentActivities } from "@/components/user/educator/dashboard/RecentActivities";
import StatCard from "@/components/user/educator/dashboard/StartCard";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { PiggyBank, TrendingUp, Users, BookOpen } from "lucide-react";

export default async function EducatorDashboardPage() {
  const user = await GetUserProfile();
  const supabase = await createClient();

  const [
    revenueResult,
    studentsResult,
    coursesResult,
    activitiesResult,
    alertsResult,
  ] = await Promise.all([
    supabase.rpc("get_educator_revenue", { p_educator_id: user?.id }),
    supabase.rpc("get_educator_students", { p_educator_id: user?.id }),
    supabase.rpc("get_educator_courses", { p_educator_id: user?.id }),
    supabase.rpc("get_educator_recent_activities", {
      p_educator_id: user?.id,
      p_limit: 5,
    }),
    supabase.rpc("get_educator_pending_alerts", { p_educator_id: user?.id }),
  ]);

  const revenue = revenueResult.data?.[0] || {
    total_revenue: 0,
    growth_percent: null,
  };
  const students = studentsResult.data?.[0] || {
    total_students: 0,
    growth_percent: null,
  };
  const courses = coursesResult.data?.[0] || {
    total_courses: 0,
    draft_count: 0,
    published_count: 0,
  };

  const activities = activitiesResult.data || [];
  const alerts = alertsResult.data || [];

  const stats = [
    {
      title: "Revenue",
      value: formatPrice(revenue.total_revenue),
      growth: revenue.growth_percent,
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "Total Students",
      value: students.total_students,
      growth: students.growth_percent,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Courses",
      value: courses.published_count,
      subtitle: `${courses.draft_count} drafts`,
      icon: BookOpen,
      color: "text-purple-500",
    },
    {
      title: "Coming Soon",
      value: "—",
      icon: PiggyBank,
      color: "text-gray-400",
    },
  ];

  return (
    <>
      <DashboardCaption
        heading={`Welcome back, ${user?.full_name || "Educator"}! 👋🏾`}
        text="Here's what's happening with your courses today"
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard stat={stat} key={index} />
        ))}
      </div>

      {/* quick actions */}
      <QuickActions userId={user?.id} />

      {/* Recent Activities & Pending Alerts */}
      <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities activities={activities} />
        </div>
        <div className="lg:col-span-1">
          <PendingAlerts alerts={alerts} />
        </div>
      </section>
    </>
  );
}
