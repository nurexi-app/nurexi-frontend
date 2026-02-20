"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { endExam, submitExam } from "@/lib/features/exam/examSlice";
import { useRouter } from "next/navigation";

// type is finish then submit exam otherwise end exam
const EndExamDialog = ({
  type = "finish",
  children,
}: {
  type: string;
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const { answers, questions } = useAppSelector((store) => store.exam);
  const router = useRouter();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            You have answered {answers.length} out of {questions.length}{" "}
            questions.
          </DialogDescription>

          <DialogDescription>
            This action cannot be undone. This will submit your exam.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            {type === "finish" ? (
              <Button
                onClick={() => {
                  dispatch(submitExam());
                }}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant={"destructive"}
                onClick={() => {
                  dispatch(endExam());
                  router.push("/learner/exam");
                }}
              >
                Quit
              </Button>
            )}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EndExamDialog;
