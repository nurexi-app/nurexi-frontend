"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/StoreHooks";
import { setMode } from "@/lib/features/exam/examSlice";

interface PracticeConfigModalProps {
  id: number;
  name: string;
  children: React.ReactNode;
}

export default function PracticeConfigModal({
  id,
  name,
  children,
}: PracticeConfigModalProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState<string>("20");
  const [difficulty, setDifficulty] = useState<string>("all");

  const handleStart = () => {
    dispatch(setMode("learning"));
    setOpen(false);
    router.push(
      `/learner/practice/${id}?limit=${limit}&difficulty=${difficulty}`,
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Practice Session</DialogTitle>
          <DialogDescription>
            Select your preferences for {name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="limit" className="text-sm font-medium">
              Number of Questions
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="10">10 Questions</option>
              <option value="20">20 Questions</option>
              <option value="30">30 Questions</option>
              <option value="40">40 Questions</option>
              <option value="50">50 Questions</option>
              <option value="-1">All Questions</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="difficulty" className="text-sm font-medium">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleStart}>Start Practice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
