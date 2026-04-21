import Logo from "@/components/web/Logo";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Enter Your Mail to get OTP",
};
export default function ResetPassword() {
  return (
    <>
      <div className="text-center flex flex-col mb-4 items-center gap-2 ">
        <Logo />
        <p className="bodyText">Enter your email to reset your password</p>
      </div>

      <ResetPasswordForm />

      <div className="text-center flex mt-4 justify-center items-center gap-1 ">
        <p className="bodyText">Don`t have an account?</p>
        <Link href={"/login"} className="text-primary text-sm hover:underline">
          Login
        </Link>
      </div>
    </>
  );
}
