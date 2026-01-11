import {configureStore} from "@reduxjs/toolkit";
import {apiCategory} from "../services/apiCategory.ts";
import {apiAccount} from "../services/apiAccount.ts";
import authReducer from "./authSlice";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiCategory.reducerPath]: apiCategory.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware, apiAccount.middleware),
});

//Типи які знаходяться у Redux
export type RootState = ReturnType<typeof store.getState>;
//Метод, який дає команди для reduder - залогінь, вийди із акаунта
export type AppDispatch = typeof store.dispatch;

//виклик різних методів із глобального стора
export const useAppDispatch: () => AppDispatch = useDispatch;
//Отримуємо дані із глобального стора на основі наших типів, які там є
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;