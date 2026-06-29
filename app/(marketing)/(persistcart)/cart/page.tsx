import { Metadata } from "next";
import Cart from "./Cart";

export const metadata: Metadata = {
  title: "cart",
};
export default function CartPage() {
  return <Cart />;
}
