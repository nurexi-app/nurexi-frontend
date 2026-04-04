"use client";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
const ShowPageName = () => {
  const pathname = usePathname();

  // Remove leading/trailing slashes and split by "/"
  const segments = pathname.replace(/^\/|\/$/g, "").split("/");

  let pageName = "";

  if (segments[0] === "learner") {
    pageName = segments.length === 1 ? "dashboard" : segments[1];
  }

  return (
    <div className="md:hidden px-2 mt-1 mb-2 flex items-center justify-between">
      <h3 className="font-medium capitalize text-secondary text-lg leading-[130%]">
        {pageName}
      </h3>
      <Badge className="bg-primary-light-active text-primary font-normal text-lg">
        6 days 🔥
      </Badge>
    </div>
  );
};

export default ShowPageName;
