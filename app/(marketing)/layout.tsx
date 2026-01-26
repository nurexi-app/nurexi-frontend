import Navbar from "@/components/web/Navbar";
import { ReactNode } from "react";
import Footer from "../../components/_sections/Footer";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
