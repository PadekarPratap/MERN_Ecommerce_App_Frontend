import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cartSlice";
import userReducer from "../features/userSlice";
import globalReducer from "../features/globalSlice";



export const store = configureStore({
    reducer:{
        cart: cartReducer,
        user: userReducer,
        global: globalReducer
    }

})

