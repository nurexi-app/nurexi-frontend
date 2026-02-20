import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/hooks/StoreHooks";
import { selectPerformanceBySubject } from "@/lib/features/exam/customSelector";
const PerformanceBySubject = () => {
  const performance = useAppSelector(selectPerformanceBySubject);
  return (
    <div className="my-4  ">
      <p className="bodyText text-muted-foreground mb-4">
        Performance by topic
      </p>

      <div className="flex items-center gap-4 flex-col sm:flex-row justify-between flex-wrap">
        {Object.entries(performance).map(([subject, data]) => (
          <Item
            variant={"outline"}
            key={subject}
            className=" py-5 w-full sm:w-[48%]"
          >
            <ItemContent>
              <ItemTitle>{subject}</ItemTitle>
              <ItemDescription>
                {data.correct}/{data.total} correct
              </ItemDescription>
            </ItemContent>

            <Badge>{data.percentage}%</Badge>
            <Progress className="h-2" value={data.percentage} />
          </Item>
        ))}
      </div>
    </div>
  );
};

export default PerformanceBySubject;
