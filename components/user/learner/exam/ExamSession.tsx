"use client";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import {
  setExamDuration,
  setExamSession,
  startExam,
} from "@/lib/features/exam/examSlice";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface SessionProp {
  id: number;
  created_at: Date;
  session_name: string;
}

const ExamSession = () => {
  const { examType, duration } = useAppSelector((store) => store.exam);
  const dispatch = useAppDispatch();

  const supabase = createClient();
  const [session, setSession] = useState<SessionProp[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("exam_session")
        .select("*")
        .eq("exam_id", 1);

      setSession(data as SessionProp[]);
    };
    fetch();
  }, []);
  return (
    <div>
      {/* NMCN CONFIG */}
      {examType.toLowerCase() === "nmcn" && (
        <div className="space-y-4 p-4 bg-white">
          {/* Exam Type */}
          <div className="space-y-2">
            <Label htmlFor="examType">Exam Type</Label>
            <select
              id="examType"
              disabled
              defaultValue="nmcn"
              className="h-9 w-full rounded-md bg-primary-light px-3 text-sm border border-input focus:outline-none"
            >
              <option value="nmcn">NMCN</option>
            </select>
          </div>

          {/* exam sesstion */}
          <div className="space-y-2">
            <Label htmlFor="examSession">Exam Session</Label>
            <select
              id="examSession"
              // defaultValue={duration}
              onChange={(e) => dispatch(setExamSession(Number(e.target.value)))}
              className="h-9 w-full rounded-md bg-primary-light px-3 text-sm border border-input focus:outline-none"
            >
              {session.map((sess) => (
                <option key={sess.id} value={Number(sess.id)}>
                  {sess.session_name}
                </option>
              ))}
            </select>
          </div>
          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              defaultValue={duration}
              onChange={(e) =>
                dispatch(setExamDuration(Number(e.target.value) * 60))
              }
              className="h-9 w-full rounded-md bg-primary-light px-3 text-sm border border-input focus:outline-none"
            >
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
              <option value={120}>120 minutes</option>
            </select>
          </div>

          <div className="mt-6 rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold">Exam details</h3>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>100 questions</li>
              <li>Answers available after submission</li>
              <li>Auto submission when time elapses</li>
              <li>Duration based on selected minutes</li>
            </ul>
          </div>

          <Link
            href="/learner/exam/NMCN"
            onClick={() => dispatch(startExam("nmcn"))}
            className="w-full"
          >
            <Button> Start Exam</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ExamSession;
