import Logo from "@/components/web/Logo";
import Image from "next/image";
import { RegisterForm } from "./RegisterForm";
import QuoteSwiper from "./QuoteSwipper";
import Link from "next/link";

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

      <section className=" p-4 lg:p-16 basis-full md:basis-1/2 overflow-auto ">
        <div className="text-center flex flex-col mb-4 items-center gap-2 ">
          <Logo />
          <p className="bodyText">
            Sign up to join thousands preparing for NMCN exams
          </p>
        </div>
        <RegisterForm />

        <div className="text-center flex mt-4 justify-center items-center gap-1 ">
          <p className="bodyText">Don`t have an account?</p>
          <Link
            href={"/login"}
            className="text-primary text-sm hover:underline"
          >
            Login
          </Link>
        </div>
      </section>
    </main>
  );
}
