"use client";

import { useSearchParams } from "next/navigation";
import PerformanceTrend from "./PerformanceTrend";
import TopicsPerformance from "./TopicsPerformance";

interface ViewProps {
  userId: string;
  barChartData: Array<{
    subject: string;
    score: number;
    correct: number;
    total: number;
  }>;
}

const View = ({ userId, barChartData }: ViewProps) => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "Overview";

  if (view === "Overview") {
    return <PerformanceTrend userId={userId} />;
  }
  if (view === "Topics") {
    return <TopicsPerformance data={barChartData} />;
  }

  return <div>View</div>;
};

export default View;
