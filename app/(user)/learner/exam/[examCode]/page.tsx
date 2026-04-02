// app/learner/exam/[examCode]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardCaption from "@/components/web/DashboardCaption";
import ExamSessionSelector from "@/components/user/learner/exam/ExamSelectorSession";

interface ExamPageProps {
  params: Promise<{
    examCode: string;
  }>;
}

export default async function ExamSessionPage({ params }: ExamPageProps) {
  const { examCode } = await params;
  const supabase = await createClient();

  // Step 1: Get the exam details with sessions (NO question count)
  const { data: exam, error: examError } = await supabase
    .from("exams")
    .select(
      `
      *,
      exam_session (
        id,
        session_name,
        year
      )
    `,
    )
    .eq("code", examCode)
    .single();

  if (examError || !exam) {
    notFound();
  }

  // Step 2: Get current user for access checks
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Step 3: Check which sessions the user already has access to
  let accessibleSessionIds: number[] = [];

  if (user) {
    // For each session, check if user has access
    const sessionAccessPromises = exam.exam_session.map(
      async (session: any) => {
        const { data: hasAccess } = await supabase.rpc("check_exam_access", {
          p_user_id: user.id,
          p_exam_session_id: session.id,
        });
        return { sessionId: session.id, hasAccess };
      },
    );

    const accessResults = await Promise.all(sessionAccessPromises);
    accessibleSessionIds = accessResults
      .filter((result) => result.hasAccess)
      .map((result) => result.sessionId);
  }

  // Step 4: Prepare sessions with access info (NO question count)
  const sessionsWithAccess = exam.exam_session.map((session: any) => ({
    id: session.id,
    session_name: session.session_name,
    year: session.year,
    hasAccess: accessibleSessionIds.includes(session.id),
  }));

  return (
    <>
      <DashboardCaption
        heading={exam.name}
        text={`Select a session to start your ${exam.name} mock exam`}
      />

      <section className="p-4 space-y-6">
        {/* Exam Info Card */}
        <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="text-4xl">{exam.icon || "📚"}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{exam.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {exam.description}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4 text-primary" />
                    <span>
                      {exam.exam_session?.length || 0} sessions available
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>Choose your duration</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Selection Card */}
        <Card>
          <CardContent className="p-6">
            <ExamSessionSelector
              examName={exam.name}
              examCode={exam.code}
              sessions={sessionsWithAccess}
              user={user}
            />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
