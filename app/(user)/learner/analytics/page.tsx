import SwitchView from "@/components/user/learner/analytics/SwitchView";
import View from "@/components/user/learner/analytics/View";
import DashboardCaption from "@/components/web/DashboardCaption";
import { GetUserProfile } from "@/lib/actions/auth";
import {
  GetBarChartData,
  GetLineChartData,
} from "@/lib/actions/learnerAnalytic-action";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics",
  description: "Analytics",
};

export default async function Page() {
  const user = await GetUserProfile();

  const barChartData = await GetBarChartData(user?.id);

  const lineChartData = await GetLineChartData(user?.id, 30);

  return (
    <>
      <DashboardCaption
        heading={`Your Progress, ${user?.full_name || "Learner"}!`}
        text="Track your learning journey and celebrate your achievements"
      />

      <div>
        <SwitchView />
        <View userId={user?.id} barChartData={barChartData} />
      </div>
    </>
  );
}
