import { LucideIcon } from "lucide-react";

export default function GoalCard({
  icon: Icon,
  title,
  text,
  selected = false,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  selected?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative cursor-pointer rounded-xl  border p-4 hover:border-primary transition text-left flex  gap-4 ${
        selected ? "border-primary bg-primary/5" : "hover:border-primary/60"
      }`}
    >
      <Icon className="h-6 w-6 md:w-10 md:h-10 text-primary mb-2" />

      <div className="space-y-1">
        <h3 className="font-normal">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>

      {/* Checkbox hint */}
      <span
        className={`absolute right-3 top-3 h-4 w-4 rounded-full border flex items-center justify-center transition-colors ${
          selected ? "bg-primary border-primary" : "bg-transparent"
        }`}
      />
    </button>
  );
}
