

import { createSlice } from "@reduxjs/toolkit";

// Get the correct product ID
const getProductId = (item) => item.productId || item._id;

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const itemId = getProductId(item);

      const existItem = state.cartItems.find(
        (x) => getProductId(x) === itemId
      );

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          getProductId(x) === itemId ? item : x
        );
      } else {
        state.cartItems.push(item);
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;

      state.cartItems = state.cartItems.filter(
        (x) => getProductId(x) !== itemId
      );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const { addToCart, removeFromCart, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
