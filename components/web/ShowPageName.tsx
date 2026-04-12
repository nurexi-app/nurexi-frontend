"use client";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const ShowPageName = ({ userId }: { userId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState("");

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("learner_stats")
        .select("current_streak")
        .eq("user_id", userId)
        .single();
      if (error) {
        console.log(error);
      }
      if (data) {
        setStreak(data?.current_streak);
        setIsLoading(false);
      }
    }
    fetch();
  }, []);

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
      {isLoading ? (
        <Skeleton className="w-[100px] h-[20px]" />
      ) : (
        <Badge className="bg-primary-light-active text-primary font-normal text-lg">
          {streak} days 🔥
        </Badge>
      )}
    </div>
  );
};

export default ShowPageName;
