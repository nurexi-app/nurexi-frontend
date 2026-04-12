"use server";

import { createClient } from "../supabase/server";

interface TopicPerformance {
  name: string;
  correct: number;
  total: number;
  percentage: number;
}

interface ExamResult {
  correctCount: number;
  totalQuestions: number;
  sessionId: string;
  performanceBySubject: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
}

export async function uploadLearnerAnalytics(
  result: ExamResult,
  score: number,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  const topics = Object.entries(result.performanceBySubject).map(
    ([name, data]) => ({
      name: name,
      correct: data.correct,
      total: data.total,
      percentage: data.percentage,
    }),
  );

  const { error: analyticsError } = await supabase
    .from("learner_analytics")
    .insert({
      user_id: user.id,
      session_id: parseInt(result.sessionId),
      score: score,
      completed_at: new Date().toISOString(),
      topics: topics,
    });

  if (analyticsError) {
    return { success: false, error: analyticsError.message };
  }

  return { success: true };
}

interface LineChartData {
  date: string;
  score: number;
}

export async function GetLineChartData(
  userId: string,
  days: number,
): Promise<LineChartData[]> {
  const supabase = await createClient();

  // Calculate the date range
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Fetch data from database
  const { data, error } = await supabase
    .from("learner_analytics")
    .select("completed_at, score")
    .eq("user_id", userId)
    .gte("completed_at", startDate.toISOString())
    .order("completed_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch line chart data: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Group by date and calculate average score per day
  const groupedByDate: Record<string, { total: number; count: number }> = {};

  for (const item of data) {
    const date = new Date(item.completed_at);
    const dateKey = date.toISOString().split("T")[0]; // "2024-04-10"

    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = { total: 0, count: 0 };
    }

    groupedByDate[dateKey].total += item.score;
    groupedByDate[dateKey].count += 1;
  }

  // Convert to chart format with short date
  const result: LineChartData[] = Object.entries(groupedByDate).map(
    ([dateKey, values]) => {
      const date = new Date(dateKey);
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();
      const shortDate = `${month} ${day}`;

      return {
        date: shortDate,
        score: Math.round(values.total / values.count),
      };
    },
  );

  return result;
}

interface BarChartData {
  subject: string;
  score: number;
  correct: number;
  total: number;
}

export async function GetBarChartData(userId: string): Promise<BarChartData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("learner_analytics")
    .select("topics")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to fetch bar chart data: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Aggregate topics across all attempts
  const topicMap: Record<string, { correct: number; total: number }> = {};

  for (const attempt of data) {
    const topics = attempt.topics as Array<{
      name: string;
      correct: number;
      total: number;
      percentage: number;
    }>;

    if (!topics || !Array.isArray(topics)) {
      continue;
    }

    for (const topic of topics) {
      if (!topicMap[topic.name]) {
        topicMap[topic.name] = { correct: 0, total: 0 };
      }

      topicMap[topic.name].correct += topic.correct;
      topicMap[topic.name].total += topic.total;
    }
  }

  // Convert to chart format and calculate percentage
  const result: BarChartData[] = Object.entries(topicMap).map(
    ([subject, data]) => {
      const percentage =
        data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

      return {
        subject: subject,
        score: percentage,
        correct: data.correct,
        total: data.total,
      };
    },
  );

  // Sort by score (lowest first - so weak areas appear first)
  result.sort((a, b) => a.score - b.score);

  return result;
}
