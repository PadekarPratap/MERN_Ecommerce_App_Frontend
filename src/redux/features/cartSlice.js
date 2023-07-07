import { createSlice } from "@reduxjs/toolkit";

const itemsInStorage = sessionStorage.getItem("cart")
  ? JSON.parse(sessionStorage.getItem("cart"))
  : [];

const shippingAddressInStorage = sessionStorage.getItem("shippingAddress")
  ? JSON.parse(sessionStorage.getItem("shippingAddress"))
  : {};

const paymentMethodInStorage = sessionStorage.getItem("paymentMethod")
  ? JSON.parse(sessionStorage.getItem("paymentMethod"))
  : "";

const initialState = {
  cartItems: itemsInStorage,
  shippingAddress: shippingAddressInStorage,
  paymentMethod: paymentMethodInStorage,
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    ADD_TO_CART: (state, action) => {
      const item = action.payload;
      const itemExist = state.cartItems.find(
        (cartItem) => cartItem.product === item.product
      );
      if (itemExist) {
        return state.cartItems;
      } else {
        state.cartItems = [...state.cartItems, item];
        sessionStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
    },
    CHANGE_QTY: (state, action) => {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.product === action.payload.product
      );
      if (itemIndex !== -1) {
        state.cartItems[itemIndex].qty = action.payload.qty;
        sessionStorage.setItem("cart", JSON.stringify(state.cartItems));
      }
      return state;
    },
    REMOVE_FROM_CART: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.product !== action.payload.id
      );
      sessionStorage.setItem("cart", JSON.stringify(state.cartItems));
    },
    ADD_SHIPPING_ADDRESS: (state, action) => {
      state.shippingAddress = action.payload;
      sessionStorage.setItem(
        "shippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },
    ADD_PAYMENT_METHOD: (state, action) => {
      state.paymentMethod = action.payload;
      sessionStorage.setItem(
        "paymentMethod",
        JSON.stringify(state.paymentMethod)
      );
    },
    RESET_CART: (state) => {
      state.cartItems = [];
      state.paymentMethod = '';
      state.shippingAddress = {};
      sessionStorage.removeItem("cart");
      sessionStorage.removeItem("shippingAddress");
      sessionStorage.removeItem("paymentMethod");
    },
  },
});

export const {
  ADD_TO_CART,
  CHANGE_QTY,
  REMOVE_FROM_CART,
  ADD_SHIPPING_ADDRESS,
  ADD_PAYMENT_METHOD,
  RESET_CART
} = cartSlice.actions;
export default cartSlice.reducer;
