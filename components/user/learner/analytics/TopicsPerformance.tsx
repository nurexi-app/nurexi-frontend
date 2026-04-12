"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface TopicsPerformanceProps {
  data: Array<{
    subject: string;
    score: number;
    correct: number;
    total: number;
  }>;
}

const chartConfig = {
  score: {
    label: "Accuracy (%)",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const TopicsPerformance = ({ data }: TopicsPerformanceProps) => {
  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl min-h-96">
        <h2 className="text-sm font-medium mb-2">Topic-wise Performance</h2>
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-muted-foreground mb-2">No topic data yet</p>
          <p className="text-sm text-muted-foreground">
            Complete exams to see your performance by subject
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-2xl min-h-96">
      <h2 className="text-sm font-medium mb-2">Topic-wise Performance</h2>

      <ChartContainer
        config={chartConfig}
        className="md:max-h-[60vh] h-full md:px-2 px-0 w-full"
      >
        <BarChart data={data} layout="vertical" className="ml-0 md:ml-6">
          <XAxis
            type="number"
            dataKey="score"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            dataKey="subject"
            type="category"
            tickLine={false}
            tickMargin={8}
            axisLine={true}
            className="text-xs"
            width={100}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
            formatter={(value: any, name: any, props: any) => {
              const item = props.payload;
              return [`${value}% (${item.correct}/${item.total} questions)`];
            }}
          />
          <CartesianGrid vertical={true} />
          <Bar
            dataKey="score"
            fill="var(--color-score)"
            radius={5}
            label={{
              position: "right",
              formatter: (value: any) => `${value}%`,
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default TopicsPerformance;
