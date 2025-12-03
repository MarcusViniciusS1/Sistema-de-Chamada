// frontmarket/src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"
// import carrinhoReducer from "./carSlice" <--- LINHA REMOVIDA

export const store = configureStore({
    reducer: {
        auth : authReducer,
        // carrinho: carrinhoReducer <--- LINHA REMOVIDA
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;