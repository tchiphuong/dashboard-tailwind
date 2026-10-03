import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import type { ApiResponse } from "@/types";

import { getAccessToken, getRefreshToken, removeAccessToken, setAccessToken, setRefreshToken } from "./cookies";
import { AUTH_ENDPOINTS } from "./api-endpoints";
import { handleMockFallback } from "./mock-api-fallback";

interface FailedQueueItem {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error || !token) {
            prom.reject(error || new Error("Làm mới phiên thất bại"));
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

/**
 * API Client cho UniManage
 * Tích hợp với backend ASP.NET Core
 */
class ApiClient {
    private readonly instance: AxiosInstance;

    constructor() {
        const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        // Auto-fix for local development port mismatch (IIS Express vs Kestrel)
        const baseURL = envUrl;

        this.instance = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                Accept: "text/plain",
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                // Add token if exists
                const token = getAccessToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                // Add correlation ID
                config.headers["X-Correlation-Id"] =
                    this.generateCorrelationId();

                // Add Accept-Language from current locale
                // Backend CultureMiddleware requires this header
                if (typeof window !== "undefined") {
                    const locale =
                        window.location.pathname.split("/")[1] || "vi";
                    const langMap: Record<string, string> = {
                        vi: "vi-VN",
                        en: "en-US",
                    };
                    config.headers["Accept-Language"] =
                        langMap[locale] || "vi-VN";
                }

                return config;
            },
            (error) => Promise.reject(error),
        );

        // Response interceptor
        this.instance.interceptors.response.use(
            (response) => response,
            async (error: AxiosError<ApiResponse>) => {
                const originalRequest = error.config as AxiosRequestConfig & {
                    _retry?: boolean;
                };

                if (
                    error.response?.status === 401 &&
                    originalRequest &&
                    !originalRequest._retry
                ) {
                    return this.handleUnauthorizedError(error, originalRequest);
                }

                throw error;
            },
        );
    }

    private async handleUnauthorizedError(
        error: AxiosError<ApiResponse>,
        originalRequest: AxiosRequestConfig & { _retry?: boolean },
    ) {
        if (isRefreshing) {
            return this.waitForTokenRefresh(originalRequest);
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            return this.handleRefreshFailure(error);
        }

        try {
            return await this.performTokenRefresh(
                refreshToken,
                originalRequest,
            );
        } catch (refreshError) {
            return this.handleRefreshFailure(refreshError);
        } finally {
            isRefreshing = false;
        }
    }

    private async waitForTokenRefresh(originalRequest: AxiosRequestConfig) {
        const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        });
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return this.instance(originalRequest);
    }

    private async performTokenRefresh(
        refreshToken: string,
        originalRequest: AxiosRequestConfig,
    ) {
        const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.post(
            `${baseURL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } },
        );

        const data = response.data?.data;
        if (!data?.accessToken) {
            throw new Error("Invalid token response");
        }

        setAccessToken(data.accessToken);
        if (data.refreshToken) {
            setRefreshToken(data.refreshToken);
        }

        processQueue(null, data.accessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return this.instance(originalRequest);
    }

    private handleRefreshFailure(error: unknown) {
        isRefreshing = false;
        processQueue(error, null);
        if (typeof window !== "undefined") {
            removeAccessToken();
            window.location.href = "/auth/login";
        }
        throw error;
    }

    private generateCorrelationId(): string {
        if (
            typeof crypto !== "undefined" &&
            typeof crypto.randomUUID === "function"
        ) {
            return crypto.randomUUID();
        }
        // Fallback for older environments
        return `${Date.now()}-fallback-id`;
    }

    async get<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.get<ApiResponse<T>>(url, config);
            return response.data;
        } catch (error) {
            const fallback = await handleMockFallback<T>("get", url, undefined, config?.params);
            if (fallback) return fallback;
            throw error;
        }
    }

    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.post<ApiResponse<T>>(
                url,
                data,
                config,
            );
            return response.data;
        } catch (error) {
            const fallback = await handleMockFallback<T>("post", url, data, config?.params);
            if (fallback) return fallback;
            throw error;
        }
    }

    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.put<ApiResponse<T>>(
                url,
                data,
                config,
            );
            return response.data;
        } catch (error) {
            const fallback = await handleMockFallback<T>("put", url, data, config?.params);
            if (fallback) return fallback;
            throw error;
        }
    }

    async delete<T>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.delete<ApiResponse<T>>(
                url,
                config,
            );
            return response.data;
        } catch (error) {
            const fallback = await handleMockFallback<T>("delete", url, undefined, config?.params);
            if (fallback) return fallback;
            throw error;
        }
    }

    async patch<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        try {
            const response = await this.instance.patch<ApiResponse<T>>(
                url,
                data,
                config,
            );
            return response.data;
        } catch (error) {
            const fallback = await handleMockFallback<T>("patch", url, data, config?.params);
            if (fallback) return fallback;
            throw error;
        }
    }
}

export const apiClient = new ApiClient();
