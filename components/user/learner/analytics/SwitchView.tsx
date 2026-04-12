"use client";

import { handleSearchParamsChange } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const tabs = ["Overview", "Topics", "Achievements"];

const SwitchView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "Overview";

  function handleViewChange(view: string) {
    const params = handleSearchParamsChange(searchParams, "view", view);
    router.push(`/learner/analytics?${params}`);
  }

  return (
    <div className="rounded-[40px] my-4.5 w-fit p-1.25 text-black text-sm bg-[#E8E8E8] flex items-center gap-2">
      {tabs.map((view, index) => (
        <button
          onClick={() => handleViewChange(view)}
          key={index}
          className={`rounded-[40px] transition-colors duration-150 py-1.25 px-2.5  cursor-pointer ${currentView === view ? "bg-white" : "bg-transparent"}`}
        >
          {view}
        </button>
      ))}
    </div>
  );
};

export default SwitchView;
