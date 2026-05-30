import Navbar from "@/components/web/Navbar";
import Footer from "../../components/_sections/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = !!data?.user;

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </>
  );
}
