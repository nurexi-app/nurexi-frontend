import DashboardCaption from "@/components/web/DashboardCaption";

export const metadata = {
  title: "Resource Library | Nurexi",
  description:
    "Access nursing study materials, cram sheets and more to ace exam.",
};

export default function LibraryPage() {
  return (
    <main className="">
      <DashboardCaption
        heading={"Your Study Arsenal"}
        text="Curated resources to help you master nursing concepts and pass with confidence."
      />

      {/* Quick Stats Bar */}
    </main>
  );
}
