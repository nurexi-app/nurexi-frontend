"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { clearCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function Cart() {
  const router = useRouter();
  const supabase = createClient();

  const handleProceedToCheckout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Open modal by navigating to intercepted route
      router.push("/login");
      return;
    }

    router.push("/checkout");
  };

  const { items: cartItems, discount } = useAppSelector((store) => store.cart);
  const dispatch = useAppDispatch();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal - discount;

  function handleRemoveFromCart(id: string) {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  }

  function handleClearCart() {
    dispatch(clearCart());
    toast.success("Cart cleared");
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything yet
        </p>
        <Link href="/explore?tab=bundles">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-18">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.type === "bundle"
                        ? `${item.sessionCount} sessions`
                        : "Course"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleRemoveFromCart(item.id)}
                    size={"icon"}
                    className="hover:text-white hover:border-red-500 hover:bg-red-500"
                    variant={"outline"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6">
                {/* quantity update */}
                {/* <div className="flex items-center gap-2">
                    <span className="text-sm">Qty:</span>
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="border rounded-md px-2 py-1 text-sm"
                    >
                      {[1, 2, 3, 4, 5].map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div> */}
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between gap-4">
            <Link href="/explore?tab=bundles">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Button
              variant="outline"
              className="hover:text-white hover:border-red-500 hover:bg-red-500"
              onClick={() => handleClearCart()}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-80 lg:sticky lg:top-14 h-fit">
          <div className="bg-white rounded-xl border p-5 space-y-4">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Coupon code</p>
              <div className="flex gap-2">
                <Input placeholder="Enter code" className="flex-1" />
                <Button variant="outline" size="sm">
                  Apply
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
