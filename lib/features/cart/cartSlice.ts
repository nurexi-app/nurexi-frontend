import { CartItem } from "@/lib/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
}

const initialState: CartState = {
  items: [],
  couponCode: null,
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push({ ...action.payload, quantity: 1 });
    },

    // Remove item from cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    // Clear entire cart
    clearCart: (state) => {
      state.items = [];
      state.couponCode = null;
      state.discount = 0;
    },

    // Apply coupon
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discount: number }>,
    ) => {
      state.couponCode = action.payload.code;
      state.discount = action.payload.discount;
    },
  },
});

export const { addToCart, removeFromCart, clearCart, applyCoupon } =
  cartSlice.actions;

export default cartSlice.reducer;
