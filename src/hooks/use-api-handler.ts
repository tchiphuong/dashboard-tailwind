"use client";

import { useCallback } from "react";

import { useAppToast } from "@/components/common";
import { ApiResponse } from "@/types/api";
import { handleApiError } from "@/lib/utils";

export const useApiHandler = () => {
    const toast = useAppToast();

    /**
     * Handle standard API response
     * @param response Response object from API
     * @param onSuccess Callback on success
     * @param successMessage Message to display on success (optional)
     */
    const handleResponse = useCallback(
        <T>(
            response: ApiResponse<T>,
            onSuccess: (data: T) => void,
            successMessage?: string,
            onError?: (errorMsg: string) => void,
            showToastOnError: boolean = true,
            showToastOnSuccess: boolean = true,
        ) => {
            if (
                response.returnCode === 0 ||
                (response as ApiResponse<T> & { success?: boolean }).success
            ) {
                const toastMsg = successMessage || response.message;
                if (showToastOnSuccess && toastMsg) {
                    toast.success(toastMsg);
                }
                if (response.data !== undefined) {
                    onSuccess(response.data);
                }
            } else {
                const errorMsg = handleApiError(response, "An error occurred");
                if (showToastOnError) toast.error(errorMsg);
                if (onError) {
                    onError(errorMsg);
                }
            }
        },
        [toast],
    );

    /**
     * Handle unexpected API errors (used in try-catch)
     * @param error Error object
     * @param fallbackMessage Fallback message if error has no specific message
     */
    const handleError = useCallback(
        (
            error: unknown,
            fallbackMessage = "An error occurred",
            showToastOnError: boolean = true,
        ) => {
            const errorMsg = handleApiError(error, fallbackMessage);
            if (showToastOnError) toast.error(errorMsg);
        },
        [toast],
    );

    /**
     * Execute an API call and handle response + error in one step
     * Returns { success, data?, error? } — reduces boilerplate when calling APIs
     * @param apiCall Async function returning ApiResponse<T>
     * @param onSuccess Callback on success (optional, runs before returning result)
     * @param successMessage Success toast message (optional)
     */
    const executeApiCall = useCallback(
        async <T>(
            apiCall: () => Promise<ApiResponse<T>>,
            options?: {
                onSuccess?: (data: T) => void;
                successMessage?: string;
                showToastOnSuccess?: boolean;
                showToastOnError?: boolean;
            },
        ): Promise<{ success: boolean; data?: T; error?: string }> => {
            try {
                const response = await apiCall();
                let result: { success: boolean; data?: T; error?: string } = {
                    success: false,
                };

                handleResponse(
                    response,
                    (data) => {
                        if (options?.onSuccess) options.onSuccess(data);
                        result = { success: true, data };
                    },
                    options?.successMessage,
                    (errorMsg) => {
                        result = { success: false, error: errorMsg };
                    },
                    options?.showToastOnError !== false, // defaults to true
                    options?.showToastOnSuccess !== false, // defaults to true
                );

                return result;
            } catch (err: unknown) {
                handleError(
                    err,
                    "An error occurred",
                    options?.showToastOnError !== false,
                );
                const errorMsg = handleApiError(err);
                return { success: false, error: errorMsg };
            }
        },
        [handleResponse, handleError],
    );

    return { handleResponse, handleError, executeApiCall };
};
