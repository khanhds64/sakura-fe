import axios from "axios";
import { DefaultApi } from "./api";
import { Configuration } from "./configuration";

const instance = axios.create({
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login" &&
            error.response?.status === 401
        ) {
            window.location.pathname = "/login";
        }

        return Promise.reject(error);
    },
);

export const apiClient = new DefaultApi(
    new Configuration(),
    process.env.NEXT_PUBLIC_API_URL,
    instance,
);