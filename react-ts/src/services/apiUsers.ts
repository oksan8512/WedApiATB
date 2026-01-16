import { createApi } from "@reduxjs/toolkit/query/react";
import { serverBaseQuery } from "../utils/fetchBaseQuery";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    dateCreated: string;
    roles: string[];
}

export const apiUsers = createApi({
    reducerPath: "apiUsers",
    baseQuery: serverBaseQuery("users"),
    tagTypes: ["Users"],
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => "",
            providesTags: ["Users"],
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useDeleteUserMutation,
} = apiUsers;