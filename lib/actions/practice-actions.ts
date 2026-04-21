"use server";

import { createClient } from "@/lib/supabase/server";
import { DifficultyLevel, Question, QuestionType } from "../types/questions";

interface AccessibleSession {
  id: number;
  session_name: string;
  year: number;
  exam_name: string;
}

interface SubjectWithCount {
  id: number;
  name: string;
  questionCount: number;
}

interface PracticeQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  subject_id: number;
  subject_name: string;
}
export async function GetAccessibleSessions(userId: string) {
  const supabase = await createClient();
  const { data: freeBundles, error: freeError } = await supabase
    .from("bundles")
    .select("id")
    .eq("is_free", true);

  if (freeError) {
    throw new Error(`Failed to fetch free bundles: ${freeError.message}`);
  }

  const freeBundleIds = freeBundles?.map((b) => b.id) || [];

  // get all purchased bundles for the user
  const { data: purchasedBundles, error: purchasedError } = await supabase
    .from("purchases")
    .select("bundle_id")
    .eq("user_id", userId)
    .eq("status", "completed");

  if (purchasedError) {
    throw new Error(
      `Failed to fetch purchased bundles: ${purchasedError.message}`,
    );
  }

  const purchasedBundleIds = purchasedBundles?.map((b) => b.bundle_id) || [];

  // combine them
  const allBundleIds = [...freeBundleIds, ...purchasedBundleIds];

  if (allBundleIds.length === 0) {
    return [];
  }

  // get all session from these bundles

  const { data: bundleQuestions, error: bqError } = await supabase
    .from("bundle_questions")
    .select("exam_session_id")
    .in("bundle_id", allBundleIds);

  if (bqError) {
    throw new Error(`Failed to fetch bundle questions: ${bqError.message}`);
  }
  // remove dublicate session ids
  const sessionIds = [
    ...new Set(bundleQuestions?.map((bq) => bq.exam_session_id) || []),
  ];

  if (sessionIds.length === 0) {
    return [];
  }

  // Step 5: Get session details with exam names
  const { data: sessions, error: sessionError } = await supabase
    .from("exam_session")
    .select(
      `
      id,
      session_name,
      year,
      exam:exams!exam_session_exam_id_fkey (
      name
    )
    `,
    )
    .in("id", sessionIds)
    .order("year", { ascending: false });

  if (sessionError) {
    throw new Error(`Failed to fetch sessions: ${sessionError.message}`);
  }

  // Format the response
  const formattedSessions: AccessibleSession[] = sessions.map((session) => ({
    id: session.id,
    session_name: session.session_name,
    year: session.year,
    exam_name: (session as any).exam?.name || "Unknown",
  }));

  return formattedSessions;
}

// ============================================
// FUNCTION 2: Get all subjects with question counts
// ============================================

export async function GetSubjectsWithCounts(
  userId: string,
): Promise<SubjectWithCount[]> {
  const supabase = await createClient();

  // Step 1: Get accessible session IDs
  const accessibleSessions = await GetAccessibleSessions(userId);
  const sessionIds = accessibleSessions.map((s) => s.id);

  if (sessionIds.length === 0) {
    return [];
  }

  // Get all questions from accessible sessions, with their subjects
  const { data, error } = await supabase
    .from("questions")
    .select(
      `
      subject_id,
      subjects (
        id,
        name
      )
    `,
    )
    .in("exam_session_id", sessionIds);

  if (error) {
    throw new Error(`Failed to fetch subjects: ${error.message}`);
  }

  // Step 3: Count questions per subject using a Map
  const subjectMap = new Map<
    number,
    { id: number; name: string; count: number }
  >();

  for (const item of data || []) {
    const subjectId = item.subject_id;
    const subjectName = (item.subjects as any)?.name;

    if (!subjectId || !subjectName) continue;

    if (!subjectMap.has(subjectId)) {
      subjectMap.set(subjectId, {
        id: subjectId,
        name: subjectName,
        count: 0,
      });
    }

    const existing = subjectMap.get(subjectId);
    if (existing) {
      existing.count++;
    }
  }

  // Convert Map to array with correct property name
  const result: SubjectWithCount[] = Array.from(subjectMap.values()).map(
    (item) => ({
      id: item.id,
      name: item.name,
      questionCount: item.count,
    }),
  );

  // Step 5: Sort alphabetically
  result.sort((a, b) => a.name.localeCompare(b.name));

  return result;
}

// ============================================
// FUNCTION 3: Get practice questions for a subject
// ============================================

export async function GetPracticeQuestions(
  userId: string,
  subjectId: number | string,
  limit: number = 20,
): Promise<Question[]> {
  const supabase = await createClient();

  // Step 1: Get accessible session IDs
  const accessibleSessions = await GetAccessibleSessions(userId);
  const sessionIds = accessibleSessions.map((s) => s.id);

  if (sessionIds.length === 0) {
    return [];
  }

  // Step 2: Build query
  let query = supabase
    .from("questions")
    .select(
      `
      id,
      question_text,
      question_type,
      correct_answer,
      explanation,
      difficulty,
      is_active,
      options,
      topics,
      subject_id,
      subjects (
        name
      ),
      exam_session (
        year,
        session_name,
        exams (
          name
        )
      )
    `,
    )
    .in("exam_session_id", sessionIds)
    .eq("subject_id", subjectId)
    .eq("is_active", true);

  // Add limit if not "all" (-1 means all)
  if (limit !== -1) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  console.log(data);
  if (error) {
    throw new Error(`Failed to fetch practice questions: ${error.message}`);
  }

  // Step 4: Format questions to match your Question type
  const formattedQuestions: Question[] = (data || []).map((q: any) => {
    const examSession = Array.isArray(q.exam_session)
      ? q.exam_session[0]
      : q.exam_session;
    const exams = examSession
      ? Array.isArray(examSession.exams)
        ? examSession.exams[0]
        : examSession.exams
      : null;
    const subject = Array.isArray(q.subjects) ? q.subjects[0] : q.subjects;

    return {
      id: q.id?.toString() || "",
      question_text: q.question_text || "",
      question_type: (q.question_type as QuestionType) || "multiple_choice",
      options: q.options || [],
      correct_answer: q.correct_answer || "",
      explanation: q.explanation || "",
      topics: q.topics || [],
      exam_types: exams?.name ? [exams.name] : [],
      difficulty: (q.difficulty as DifficultyLevel) || "medium",
      year_added: examSession?.year,
      is_active: q.is_active ?? true,
      subject: subject?.name || "Unknown",
    };
  });

  // Step 5: Shuffle questions for random order
  for (let i = formattedQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [formattedQuestions[i], formattedQuestions[j]] = [
      formattedQuestions[j],
      formattedQuestions[i],
    ];
  }

  return formattedQuestions;
}
