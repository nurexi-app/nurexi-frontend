"use client";

import { useState, useEffect } from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GetLineChartData } from "@/lib/actions/learnerAnalytic-action";
import { toast } from "sonner";

const chartConfig = {
  score: {
    label: "Score",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const timeRanges = [
  { label: "7d", days: 7 },
  { label: "14d", days: 14 },
  { label: "1m", days: 30 },
  { label: "3m", days: 90 },
  { label: "6m", days: 180 },
  { label: "1y", days: 365 },
];

interface PerformanceTrendProps {
  userId: string;
}

const PerformanceTrend = ({ userId }: PerformanceTrendProps) => {
  const [data, setData] = useState<Array<{ date: string; score: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]); // Default 1 week

  useEffect(() => {
    async function fetchData() {
      if (!userId) return;

      setIsLoading(true);
      try {
        const result = await GetLineChartData(userId, selectedRange.days);

        // Only show chart if at least 2 data points
        if (result && result.length >= 2) {
          setData(result);
        } else {
          setData([]);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load chart data",
        );
        setData([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userId, selectedRange.days]);

  // Helper to determine X-axis tick interval based on data length
  const getTickInterval = (dataLength: number) => {
    if (dataLength <= 14) return 0; // Show all
    if (dataLength <= 30) return 2; // Show every 3rd
    if (dataLength <= 60) return 4; // Show every 5th
    return 6; // Show every 7th
  };

  // Empty state (no data or less than 2 points)
  if (!isLoading && (!data || data.length < 2)) {
    return (
      <div className="bg-white p-4 rounded-2xl md:h-[60dvh] min-h-79.5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium">Performance trend</h2>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <button
                key={range.days}
                onClick={() => setSelectedRange(range)}
                className={`px-3 py-1 text-xs rounded-md transition ${
                  selectedRange.days === range.days
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-full min-h-[250px] text-center">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-muted-foreground mb-2">Not enough data yet</p>
          <p className="text-sm text-muted-foreground">
            Complete at least 2 exams in the last {selectedRange.days} days to
            see your trend
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-2xl md:h-[60dvh] min-h-79.5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium">Performance trend</h2>
          <div className="flex gap-1">
            {timeRanges.map((range) => (
              <button
                key={range.days}
                className="px-3 py-1 text-xs rounded-md bg-gray-100"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center h-full min-h-[250px]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  const tickInterval = getTickInterval(data.length);

  return (
    <div className="bg-white p-4 mb-6 rounded-2xl md:min-h-[400px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
        <h2 className="text-sm font-medium">Performance trend</h2>
        <div className="flex gap-1 flex-wrap">
          {timeRanges.map((range) => (
            <button
              key={range.days}
              onClick={() => setSelectedRange(range)}
              className={`px-2 sm:px-3 py-1 text-xs rounded-md transition ${
                selectedRange.days === range.days
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[300px] w-full">
          <ChartContainer
            config={chartConfig}
            className="w-full h-[300px] sm:h-[350px] md:h-[400px]"
          >
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={true}
              />
              <XAxis
                dataKey="date"
                tickLine={true}
                tickMargin={10}
                axisLine={true}
                interval={tickInterval}
                angle={data.length > 7 ? -45 : 0}
                textAnchor={data.length > 7 ? "end" : "middle"}
                height={data.length > 7 ? 60 : 30}
              />
              <YAxis
                tickLine={true}
                tickMargin={10}
                axisLine={false}
                label={{
                  value: "Scores",
                  position: "insideLeft",
                  angle: -90,
                  style: { textAnchor: "middle" },
                }}
                domain={[0, 100]}
                width={40}
              />
              <Tooltip
                content={<ChartTooltipContent indicator="dot" />}
                cursor={false}
              />
              <Line
                dataKey="score"
                type="monotone"
                stroke="var(--color-score)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--color-score)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrend;
