export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={label}
      />
      <div
        className={`h-6 w-11 border rounded-full  transition-colors ${
          checked ? "bg-primary" : "bg-muted shadow"
        }`}
      >
        <span
          className={`block h-5 w-5 translate-y-0.5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
    </label>
  );
}
