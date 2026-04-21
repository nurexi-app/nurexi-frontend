import Logo from "@/components/web/Logo";
import UpdatePasswordForm from "./UpdatePasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Password",
  description: "Update your password",
};
export default function UpdatePassword() {
  return (
    <>
      <div className="text-center justify-center flex flex-col mb-4 items-center gap-2 ">
        <Logo />
        <p className="bodyText">Enter your new password</p>
      </div>

      <UpdatePasswordForm />
    </>
  );
}
