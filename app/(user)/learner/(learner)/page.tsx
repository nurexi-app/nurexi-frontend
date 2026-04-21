import { Card, CardDescription } from "@/components/ui/card";
import StatsGrid from "./Stats";
import { weeklyPracticeStats } from "@/lib/exports/stats";
import { RecentActivities } from "@/components/web/RecentActivities";
import { Recommended } from "@/components/web/Recomendations";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { dashboardMetadata } from "@/lib/exports/metadata";
import { AnimateIcon } from "@/components/animate-ui/icons/icon";
import QuickLinks from "@/components/web/QuickLinks";

export const metadata = dashboardMetadata;
export default async function Page() {
  const supabase = await createClient();
  const user = await GetUserProfile();

  const { data: stats, error: statsError } = await supabase
    .from("learner_stats")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  const { data: activities } = await supabase
    .from("user_activities")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(5);
  if (statsError) {
    return (
      <div className="p-4 border border-destructive bg-destructive/10 rounded">
        <p>Could not load your stats. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <>
      <DashboardCaption
        heading={`Welcome back, ${user?.full_name}!👋🏾`}
        text="Let's continue your exam preparation journey"
      />

      <StatsGrid stats={stats} />

      <div className="my-4 py-4 md:bg-white px-2 rounded-lg">
        <div className="flex flex-col gap-0.5 mb-4 md:mb-7.5 ">
          <span className="text-sm font-outfit  font-semibold leading-[130%]">
            Weekly practice
          </span>
          <span className=" text-sm font-outfit text-[#78767D] leading-[130%]">
            Jump right into your study session
          </span>
        </div>

        <div className="max-sm:bg-white grid grid-cols-3 gap-2 md:gap-4">
          {weeklyPracticeStats.map((item, index) => {
            return <QuickLinks key={index} item={item} index={index} />;
          })}
        </div>
      </div>

      {/* New Sections */}
      <div className=" flex flex-col md:flex-row gap-4">
        <RecentActivities activities={activities || []} />
        <Recommended />
      </div>
    </>
  );
}
