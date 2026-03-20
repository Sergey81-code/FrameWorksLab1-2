import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "../../types/cart";
import type { ProductResponse } from "@lab1_2/types";

interface CartState {
  items: CartItem[];
}

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem("cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

const initialState: CartState = {
  items: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<ProductResponse>) {
      const existing = state.items.find(
        (item) => item.product.id === action.payload.id
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCart(state.items);
    },
    increaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (item) item.quantity += 1;
      saveCart(state.items);
    },
    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.product.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      state.items = state.items.filter((i) => i.quantity > 0);
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart([]);
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;