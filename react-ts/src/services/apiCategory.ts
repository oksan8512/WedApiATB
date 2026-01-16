import { createApi } from "@reduxjs/toolkit/query/react";
import { serverBaseQuery } from "../utils/fetchBaseQuery";
import { serialize } from "object-to-formdata";

export interface Category {
    id: number;
    name: string;
    image: string;
}

export interface CreateCategoryRequest {
    name: string;
    image: File | null;  // ⬅️ ЗМІНЕНО
}

export const apiCategory = createApi({
    reducerPath: "apiCategory",
    baseQuery: serverBaseQuery("categories"),
    tagTypes: ["Categories"],
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => "",
            providesTags: ["Categories"],
        }),
        createCategory: builder.mutation<Category, CreateCategoryRequest>({
            query: (category) => {
                const formData = serialize(category);  // ⬅️ ДОДАНО FormData
                return {
                    url: "",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} = apiCategory;