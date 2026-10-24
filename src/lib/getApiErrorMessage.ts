import axios from "axios";


export const getApiErrorMessage = (error: Error | null): string => {
    let errorMessage: string = "Server error";
    if (axios.isAxiosError(error) && error.response?.data.message) {
        errorMessage = error.response?.data.message;
    }
    return errorMessage;
};