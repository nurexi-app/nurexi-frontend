import { GetUserProfile } from "@/lib/actions/auth";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    absolute: "Educator's Profile",
  },
  description: "Profile",
};

export default async function ProfilePage() {
  let user;
  try {
    user = await GetUserProfile();
    if (!user?.id) {
      return redirect("/login?redirectUrl=/educator/profile");
    }
  } catch (error) {
    notFound();
  }
  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
}
