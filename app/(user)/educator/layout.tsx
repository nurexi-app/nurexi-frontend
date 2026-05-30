import { IsEducator } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const isEducator = await IsEducator();
  if (!isEducator) {
    redirect("/learner");
  }
  return <>{children}</>;
}
