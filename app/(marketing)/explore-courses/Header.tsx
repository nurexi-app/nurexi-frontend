import { Input } from "@/components/ui/input";

export default function SearchHeader() {
  return (
    <div className="grid grid-cols-12 mb-4 items-center  gap-8">
      <div className="col-span-3">
        <h1 className="hero">Nurexi Top courses</h1>
      </div>

      <div className="col-span-7">
        <Input
          type="search"
          placeholder="Search for topics"
          className="h-9 w-full bg-primary-light"
        />
      </div>

      <div className="col-span-2">
        <p>203 courses</p>
      </div>
    </div>
  );
}
