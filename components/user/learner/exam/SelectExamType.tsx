"use client";

import ExamTypeCard from "@/components/web/ExamTypeCard";
import { examTypes } from "@/lib/types/mock-exam";
import { useAppContext } from "@/context/AppProvider";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SelectExamType = () => {
  const { examType, examDuration, setExamDuration } = useAppContext();

  return (
    <>
      {/* ALL EXAM TYPES */}
      {examType === "all" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {examTypes.map((exam) => (
            <ExamTypeCard key={exam.id} {...exam} />
          ))}
        </div>
      )}

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

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              defaultValue={examDuration}
              onChange={(e) => setExamDuration(Number(e.target.value) * 60)}
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

          <Link href="/learner/exam/NMCN" className="w-full">
            <Button> Start Exam</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default SelectExamType;
