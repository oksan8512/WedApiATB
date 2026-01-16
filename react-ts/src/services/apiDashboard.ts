import { createApi } from "@reduxjs/toolkit/query/react";
import { serverBaseQuery } from "../utils/fetchBaseQuery";

export interface DashboardStats {
    usersCount: number;
    categoriesCount: number;
    productsCount: number;
    ordersCount: number;
}

export interface RecentActivity {
    type: string;
    message: string;
    timestamp: string;
    icon: string;
}

export interface UsersByRole {
    role: string;
    count: number;
}

export interface TopCategory {
    id: number;
    name: string;
    image: string;
    dateCreated: string;
}

export const apiDashboard = createApi({
    reducerPath: "apiDashboard",
    baseQuery: serverBaseQuery("dashboard"),
    endpoints: (builder) => ({
        getStats: builder.query<DashboardStats, void>({
            query: () => "stats",
        }),
        getRecentActivities: builder.query<RecentActivity[], void>({
            query: () => "recent-activities",
        }),
        getUsersByRole: builder.query<UsersByRole[], void>({
            query: () => "users-by-role",
        }),
        getTopCategories: builder.query<TopCategory[], void>({
            query: () => "top-categories",
        }),
    }),
});

export const {
    useGetStatsQuery,
    useGetRecentActivitiesQuery,
    useGetUsersByRoleQuery,
    useGetTopCategoriesQuery,
} = apiDashboard;