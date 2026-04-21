import Logo from "@/components/web/Logo";
import Image from "next/image";
import QuoteSwiper from "../signup/QuoteSwipper";
import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};
export default function Register() {
  return (
    <main className="flex h-screen max-h-screen lg:gap-4 overflow-hidden ">
      <section className="basis-1/2 hidden md:block w-full relative h-full">
        <Image
          src={"/assets/auth.jpg"}
          className="object-cover"
          alt="sign up screen"
          fill
          priority
        />
        <QuoteSwiper />
      </section>

      <section className="flex flex-col justify-center p-4 lg:p-16 basis-full md:basis-1/2 overflow-auto ">
        <div className="text-center flex flex-col mb-4 items-center gap-2 ">
          <Logo />
          <p className="bodyText text-center">Welcome back</p>
        </div>
        <LoginForm />

        <div className="text-center flex mt-4 justify-center items-center gap-1 ">
          <p className="bodyText">Don`t have an account?</p>
          <Link
            href={"/signup"}
            className="text-primary text-sm hover:underline"
          >
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
}
