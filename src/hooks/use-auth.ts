import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import {
    apiClient,
    clearAuthCookies,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
} from "@/lib";
import { API_ENDPOINTS } from "@/lib/api-endpoints";
import { useApiHandler } from "@/hooks/use-api-handler";
import { authService } from "@/services/auth.service";
import { getTokenUsername } from "@/lib/utils";
import type { LoginRequest, LoginResponse } from "@/types";

/**
 * Hook for authentication handling
 */
export function useAuth() {
    const router = useRouter();
    const { executeApiCall, handleError } = useApiHandler();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Login
     */
    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await executeApiCall(
                () =>
                    apiClient.post<LoginResponse>(
                        API_ENDPOINTS.AUTH.LOGIN,
                        credentials,
                    ),
                {
                    onSuccess: (data) => {
                        // Save tokens to cookies
                        setAccessToken(
                            data.accessToken,
                            credentials.rememberMe,
                        );
                        if (data.refreshToken) {
                            setRefreshToken(
                                data.refreshToken,
                                credentials.rememberMe,
                            );
                        }
                        if (data.user) {
                            localStorage.setItem(
                                "auth_user",
                                JSON.stringify(data.user),
                            );
                        }
                    },
                    showToastOnError: false, // Do not toast, we show the error in the form
                },
            );

            if (!result.success) {
                setError(result.error || null);
            }

            return result;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            const refreshTokenValue = getRefreshToken();
            if (refreshTokenValue) {
                await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {
                    refreshToken: refreshTokenValue,
                });
            }
        } catch (err) {
            handleError(err);
        } finally {
            clearAuthCookies();
            localStorage.removeItem("auth_user");
            router.push("/auth/login");
        }
    };

    /**
     * Get current user profile
     */
    const getCurrentUser = async () => {
        const username = getTokenUsername(getAccessToken());
        if (!username) return null;

        const result = await executeApiCall(
            () => authService.getCurrentUser(username),
            { showToastOnError: false }, // Silent fail, we just return null
        );

        return result.success ? (result.data ?? null) : null;
    };

    /**
     * Check if user is authenticated
     */
    const isAuthenticated = () => {
        return !!getAccessToken();
    };

    return {
        login,
        logout,
        getCurrentUser,
        isAuthenticated: isAuthenticated(),
        getToken: getAccessToken,
        isLoading,
        error,
    };
}

/**
 * Hook to check if user is currently logged in
 */
export function useAuthCheck() {
    const { executeApiCall } = useApiHandler();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const username = getTokenUsername(getAccessToken());

        if (!username) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return false;
        }

        const result = await executeApiCall(
            () => authService.getCurrentUser(username),
            { showToastOnError: false }, // Silent fail on background auth check
        );

        if (result.success) {
            setIsAuthenticated(true);
            if (result.data) {
                localStorage.setItem("auth_user", JSON.stringify(result.data));
            }
        } else {
            clearAuthCookies();
            localStorage.removeItem("auth_user");
            setIsAuthenticated(false);
        }

        setIsLoading(false);
        return result.success;
    };

    return { isAuthenticated, isLoading, checkAuth };
}
