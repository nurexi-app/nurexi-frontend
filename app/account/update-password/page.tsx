import Logo from "@/components/web/Logo";
import UpdatePasswordForm from "./UpdatePasswordForm";

export default function UpdatePassword() {
  return (
    <>
      <div className="text-center flex flex-col mb-4 items-center gap-2 ">
        <Logo />
        <p className="bodyText">Enter your new password</p>
      </div>

      <UpdatePasswordForm />
    </>
  );
}
