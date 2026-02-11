// components/web/ExamTypeCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import Image from "next/image";
import { useAppDispatch } from "@/hooks/StoreHooks";
import { setExamType } from "@/lib/features/exam/examSlice";

interface Props {
  name: string;
  description: string;
  available: boolean;
  examsCount?: number;
  image: string;
}

export default function ExamTypeCard({
  name,
  description,
  available,
  examsCount,
  image,
}: Props) {
  const dispatch = useAppDispatch();
  return (
    <Card
      className={clsx(
        "relative transition-all",
        available
          ? "hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          : "opacity-50 cursor-not-allowed",
      )}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Image
            alt={name}
            src={image}
            width={20}
            height={20}
            className="text-primary"
          />
          <h3 className="font-semibold text-lg">{name}</h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {available ? (
          <>
            <p className="text-xs text-muted-foreground">
              {examsCount} full mock exams
            </p>

            <Button
              className="w-full mt-2"
              onClick={() => dispatch(setExamType(name))}
            >
              Start mock exam
            </Button>
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
