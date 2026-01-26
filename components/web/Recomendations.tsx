import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { recommendedItems } from "@/lib/exports/recommendations";

export function Recommended() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1  gap-4">
          {recommendedItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="
                  flex items-start gap-3
                  rounded-xl border p-4
                  hover:bg-muted/40 transition cursor-pointer
                "
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon size={18} />
                </div>

                <div className="flex flex-col">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
