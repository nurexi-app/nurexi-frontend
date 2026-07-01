import { Metadata } from "next";
import Cart from "./Cart";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "cart",
};
export default async function CartPage() {
  let userObj;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    if (error) {
      userObj = {
        success: false,
        message: error.message,
      };
    }
  }
  userObj = {
    success: true,
    data: data?.user,
  };

  return <Cart userObj={userObj} />;
}
