import {BASE_API_URL} from "../config/config";
import axios from "axios";

const api = axios.create({
    baseURL: BASE_API_URL
});

export const setupInterceptors = (setError) => {
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                const {status, message, error: errorCode} = error.response.data;

                setError({
                    status,
                    message: message || "Unknown error",
                    error: errorCode || "UNKNOWN_ERROR"
                });
            } else {
                setError({
                    message: "Server is not available now"
                });
            }
            return Promise.reject(error);
        }
    );
};

export default api;