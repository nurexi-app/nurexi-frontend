"use client";
import { useRouter } from "next/navigation";

export default function ChangePassword() {
  const router = useRouter();
  return (
    <div className="mt-2">
      <div className="space-y-px">
        <h4>Change Password</h4>
        <p className="bodyText text-muted-foreground">follow the link below</p>
      </div>
      <button
        className="text-sm font-medium text-primary hover:underline"
        onClick={() => router.push("/account/reset-password")}
      >
        Change password
      </button>
    </div>
  );
}
