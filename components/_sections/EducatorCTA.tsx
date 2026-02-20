import { Button } from "@/components/ui/button";

export default function EducatorCTA() {
  return (
    <section
      className="bg-secondaryDarkActive h-90 text-center flex items-center flex-col gap-12 text-white pt-14 pb-22 px-4   "
      id="ForEducators"
    >
      <h3 className="font-medium">Educator&apos;s Panel</h3>

      <div className="space-y-6 max-w-200 ">
        <p className="bodyText">
          Are you an experienced nurse or educator? Join Nursify as a mentor and
          share your knowledge with aspiring nurses through courses, mock exams,
          and study resources that make a real impact.
        </p>

        <Button>Become an Educator</Button>
      </div>
    </section>
  );
}
