import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import APP_ENV from "../env";

export const serverBaseQuery = (path: string) => {
    return fetchBaseQuery({
        baseUrl: `${APP_ENV.API_URL}/api/${path}`
    });
}