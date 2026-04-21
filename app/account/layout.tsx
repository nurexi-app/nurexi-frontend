import { ReactNode } from "react";
import Image from "next/image";
import QuoteSwiper from "@/app/signup/QuoteSwipper";
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className="flex h-screen max-h-screen lg:gap-4 overflow-hidden ">
      <section className="basis-1/2 hidden md:block w-full relative h-full">
        <Image
          src={"/assets/reset.png"}
          className="object-cover"
          alt="sign up screen"
          fill
          priority
        />
        <QuoteSwiper />
      </section>
      <section className="flex flex-col justify-center p-4 lg:p-16 basis-full md:basis-1/2 overflow-auto ">
        {children}
      </section>
    </main>
  );
}
