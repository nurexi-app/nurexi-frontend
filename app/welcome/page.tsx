import WelcomeSwipper from "./WelcomeSwipper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome",
  description: "Welcome to Nurexi",
};
export default function WelcomePage() {
  return (
    <main className="bg-primary/5 h-screen w-screen grid place-items-center">
      <WelcomeSwipper />
    </main>
  );
}
