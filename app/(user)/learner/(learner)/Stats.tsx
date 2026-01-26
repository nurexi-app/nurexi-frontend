import { Card, CardDescription } from "@/components/ui/card";
import { stats } from "@/lib/exports/stats";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            className="
            mt-4"
            key={item.label}
          >
            <CardDescription
              className="
            h-25
            
              flex items-center justify-between
              rounded-xl 
            
              p-4
            "
            >
              {/* LEFT: Text */}
              <div className="flex flex-col gap-2">
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-lg font-semibold">{item.value}</span>
              </div>

              {/* RIGHT: Icon */}
              <div className=" text-primary">
                <Icon size={20} />
              </div>
            </CardDescription>
          </Card>
        );
      })}
    </div>
  );
}
