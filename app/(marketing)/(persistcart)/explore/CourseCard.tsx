import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export default function CourseCard({ name, description, instructor }: any) {
  return (
    <div className="group bg-white rounded-xl border hover:shadow-lg transition-all duration-300 overflow-hidden opacity-70">
      <div className="p-5 space-y-3">
        <div className="p-2 bg-muted rounded-lg w-fit">
          <div className="h-5 w-5 rounded bg-muted-foreground/30" />
        </div>

        <h3 className="font-semibold text-lg line-clamp-1">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
        <p className="text-xs text-muted-foreground">By {instructor}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
            Coming Soon
          </span>
          <Button size="sm" variant="ghost" className="gap-2">
            <Bell className="h-4 w-4" />
            Notify
          </Button>
        </div>
      </div>
    </div>
  );
}
