import Logo from "@/components/web/Logo";
import Image from "next/image";
import { RegisterForm } from "./RegisterForm";
import QuoteSwiper from "./QuoteSwipper";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignUpImg from "@/public/assets/auth.jpg";
export default function Register() {
  return (
    <main className="flex h-screen max-h-screen lg:gap-4 overflow-hidden ">
      <section className="basis-1/2 hidden md:block w-full relative h-full">
        <Image
          src={SignUpImg}
          className="object-cover"
          alt="sign up screen"
          fill
          placeholder="blur"
        />
        <QuoteSwiper />
      </section>
      {true ? (
        <div className="container max-w-md m-auto px-4 py-16">
          <div className="bg-white rounded-xl border p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h1 className="text-2xl font-bold mb-2">Coming Soon</h1>
            <p className="text-muted-foreground mb-6">
              Nurexi is currently in private beta. Sign ups are temporarily
              closed.
            </p>

            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </div>
      ) : (
        <section className=" p-4 flex flex-col  justify-center lg:p-16 h-full basis-full md:basis-1/2 overflow-y-scroll ">
          <div className="text-center mt-4  flex flex-col items-center gap-2 ">
            <Logo />
            <p className="bodyText">
              Sign up to join thousands preparing for Nursing exams
            </p>
          </div>
          <div className="">
            <RegisterForm />
          </div>

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
      )}
    </main>
  );
}
