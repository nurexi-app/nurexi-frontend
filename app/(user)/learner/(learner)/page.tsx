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
    .limit(10);
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

      <div className="my-4 py-4 bg-white px-2 rounded-lg">
        <div className="flex flex-col gap-0.5 mb-4 md:mb-7.5 ">
          <span className="text-sm font-outfit  font-semibold leading-[130%]">
            Weekly practice
          </span>
          <span className=" text-sm font-outfit text-[#78767D] leading-[130%]">
            Jump right into your study session
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {weeklyPracticeStats.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                className={`${index === 0 ? "border-[#78767D] shadow-xs bg-secondaryDarker" : "bg-card"} border hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-23`}
                key={index}
              >
                <Link href={item.href}>
                  <CardDescription
                    className={` ${index === 0 ? "text-background" : "text-card-foreground"}  flex items-center flex-col  justify-center gap-2`}
                  >
                    <Icon className="text-primary" />
                    <span className="text-sm ">{item.label}</span>
                  </CardDescription>
                </Link>
              </Card>
            );
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
