// components/web/ExamTypeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Link from "next/link";

interface ExamTypeCardProps {
  id: number;
  name: string;
  code: string;
  icon: string;
  is_active: boolean;
  description: string;
  exam_session: Array<{ id: number; session_name: string; year: number }>;
}

export default function ExamTypeCard({
  id,
  name,
  code,
  icon,
  description,
  is_active,
  exam_session,
}: ExamTypeCardProps) {
  // Get latest session (most recent year)
  const latestSession = exam_session?.sort((a, b) => b.year - a.year)[0];
  console.log(exam_session);
  return (
    <Card
      className={clsx(
        "relative transition-all",
        is_active
          ? "hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          : "opacity-50 cursor-not-allowed",
      )}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          {/* <Image
            alt={name}
            src={image}
            width={20}
            height={20}
            className="text-primary"
          /> */}
          <p>{icon}</p>
          <h3 className="font-semibold text-lg">{name}</h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {is_active ? (
          <>
            <p className="text-xs text-muted-foreground">
              {exam_session?.length} sessions available
            </p>
            <Link href={`/learner/exam/${code || name.toLowerCase()}`}>
              <Button
                className="w-full mt-2"
                //   onClick={() => dispatch(setExamType(name))}
              >
                View
              </Button>
            </Link>
          </>
        ) : (
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-2">
            🔒 Coming soon
          </div>
        )}
      </CardContent>
    </Card>
  );
}
