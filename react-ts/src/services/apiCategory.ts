import { createApi } from "@reduxjs/toolkit/query/react";
import type { ICategoryItem } from "../types/category/ICategoryItem.ts";
import { serverBaseQuery} from "../utils/fetchBaseQuery.ts";
import type { ICategoryCreate } from "../types/category/ICategoryCreate.ts";
import { serialize } from "object-to-formdata";

export const apiCategory = createApi({
    reducerPath: 'apiCategory',
    baseQuery: serverBaseQuery("categories"),
    tagTypes: ['Categories'],
    endpoints: (builder) => ({
        getCategories: builder.query<ICategoryItem[], void>({
            query: () => ({
                url: "",
                method: "GET"
            }),
            providesTags: ['Categories'],
        }),
        getCategoryById: builder.query<ICategoryItem, number>({
            query: (id) => `/${id}`,
            providesTags: ['Categories'],
        }),
        categoryCreate: builder.mutation<void, ICategoryCreate>({
            query: (model) => {
                const formData = serialize(model);
                return {
                    method: "POST",
                    url: "",
                    body: formData
                }
            },
            invalidatesTags: ["Categories"]
        }),
        categoryUpdate: builder.mutation<ICategoryItem, { id: number; data: ICategoryCreate }>({
            query: ({ id, data }) => {
                const formData = serialize(data);
                return {
                    url: `/${id}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: builder.mutation<void, number>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Categories'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useCategoryCreateMutation,
    useCategoryUpdateMutation,
    useDeleteCategoryMutation
} = apiCategory;