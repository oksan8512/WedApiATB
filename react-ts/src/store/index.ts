import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { apiAccount } from "../services/apiAccount";
import { apiDashboard } from "../services/apiDashboard";
import { apiUsers } from "../services/apiUsers";
import authReducer from "./authSlice";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiCategory.reducerPath]: apiCategory.reducer,
        [apiDashboard.reducerPath]: apiDashboard.reducer,
        [apiUsers.reducerPath]: apiUsers.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            apiAccount.middleware,
            apiCategory.middleware,
            apiDashboard.middleware,
            apiUsers.middleware
        ),
});

// Типи які знаходяться у Redux
export type RootState = ReturnType<typeof store.getState>;
// Метод, який дає команди для reducer - залогінь, вийди із акаунта
export type AppDispatch = typeof store.dispatch;

// Виклик різних методів із глобального стора
export const useAppDispatch: () => AppDispatch = useDispatch;
// Отримуємо дані із глобального стора на основі наших типів, які там є
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;