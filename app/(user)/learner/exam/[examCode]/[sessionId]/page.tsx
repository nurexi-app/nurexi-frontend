// app/learner/exam/[examCode]/[sessionId]/page.tsx
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ExamClient from "@/components/user/learner/exam/ExamClient";
import { Suspense } from "react";
import Loader from "@/components/web/Loader";

interface Props {
  params: Promise<{
    examCode: string;
    sessionId: string;
  }>;
}

export default async function ExamPage({ params }: Props) {
  const { examCode, sessionId } = await params;
  const supabase = await createClient();

  // Step 1: Get user (middleware already ensures they're logged in)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Step 2: Check if user has access to this session
  const { data: hasAccess } = await supabase.rpc("check_exam_access", {
    p_user_id: user!.id,
    p_exam_session_id: Number(sessionId),
  });

  // Step 3: No access? Redirect to purchase
  if (!hasAccess) {
    redirect(`/purchase?session=${sessionId}&exam=${examCode}`);
  }

  // Step 4: Fetch questions from database
  const { data: questions } = await supabase
    .from("questions")
    .select(`*, subject:subject_id(name)`)
    .eq("exam_session_id", Number(sessionId))
    .order("id");

  // Step 5: No questions? Show error
  if (!questions || questions.length === 0) {
    return <div>No questions found for this exam session.</div>;
  }

  const formattedQuestions = questions.map((q: any) => ({
    id: q.id,
    question_text: q.question_text,
    question_type: q.question_type,
    subject: q.subject.name,
    difficulty: q.difficulty,
    options: q.options,
    correct_answer: q.correct_answer,
    explanation: q.explanation,
    topics: q.topics || [],
  }));

  return (
    <Suspense fallback={<Loader />}>
      <ExamClient questions={formattedQuestions} examCode={examCode} />
    </Suspense>
  );
}
