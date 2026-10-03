import type { ApiResponse } from "@/types";

import { apiClient } from "@/lib/api-client";
import { AUTH_ENDPOINTS } from "@/lib/api-endpoints";

/**
 * Auth Service - API methods for authentication
 */

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        username: string;
        displayName: string;
        email: string;
        employeeCode?: string;
    };
}

export interface CurrentUserResponse {
    id: number;
    userCode: string;
    displayName: string;
    email?: string;
    employeeCode?: string;
    roleCode?: string;
    createdAt: string;
}

export interface UserPermissionsResponse {
    username: string;
    roles: string[];
    permissions: string[];
}

export interface CheckExistsResponse {
    exists: boolean;
}

export const authService = {
    /**
     * Login to the system
     * @param username Username
     * @param password Password
     */
    async login(
        username: string,
        password: string,
    ): Promise<ApiResponse<LoginResponse>> {
        return apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
            username,
            password,
        });
    },

    /**
     * Logout from the system
     * @param refreshToken Optional refresh token to revoke
     */
    async logout(refreshToken?: string): Promise<ApiResponse<boolean>> {
        return apiClient.post<boolean>(AUTH_ENDPOINTS.LOGOUT, {
            refreshToken,
        });
    },

    /**
     * Refresh access token
     * @param refreshToken Refresh token
     */
    async refreshToken(
        refreshToken: string,
    ): Promise<ApiResponse<LoginResponse>> {
        return apiClient.post<LoginResponse>(AUTH_ENDPOINTS.REFRESH_TOKEN, {
            refreshToken,
        });
    },

    /**
     * Change password (authenticated user)
     * @param username Username
     * @param oldPassword Old password
     * @param newPassword New password
     * @param confirmPassword Confirm new password
     */
    async changePassword(
        username: string,
        oldPassword: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<ApiResponse<boolean>> {
        return apiClient.post<boolean>(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
            username,
            oldPassword,
            newPassword,
            confirmPassword,
        });
    },

    /**
     * Request password reset (forgot password)
     * @param emailOrUsername Email or username
     */
    async forgotPassword(
        emailOrUsername: string,
    ): Promise<ApiResponse<boolean>> {
        return apiClient.post<boolean>(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
            emailOrUsername,
        });
    },

    /**
     * Reset password with token from email
     * @param token Reset token
     * @param newPassword New password
     * @param confirmPassword Confirm new password
     */
    async resetPassword(
        token: string,
        newPassword: string,
        confirmPassword: string,
    ): Promise<ApiResponse<boolean>> {
        return apiClient.post<boolean>(AUTH_ENDPOINTS.RESET_PASSWORD, {
            token,
            newPassword,
            confirmPassword,
        });
    },

    /**
     * Get current user information
     * @param username Username from JWT claims
     */
    async getCurrentUser(
        username: string,
    ): Promise<ApiResponse<CurrentUserResponse>> {
        return apiClient.get<CurrentUserResponse>(
            `${AUTH_ENDPOINTS.ME}?username=${username}`,
        );
    },

    /**
     * Get user permissions and roles
     * @param username Username from JWT claims
     */
    async getPermissions(
        username: string,
    ): Promise<ApiResponse<UserPermissionsResponse>> {
        return apiClient.get<UserPermissionsResponse>(
            `${AUTH_ENDPOINTS.PERMISSIONS}?username=${username}`,
        );
    },

    /**
     * Check if username exists
     * @param username Username to check
     */
    async checkUsernameExists(
        username: string,
    ): Promise<ApiResponse<CheckExistsResponse>> {
        return apiClient.get<CheckExistsResponse>(
            AUTH_ENDPOINTS.CHECK_USERNAME(username),
        );
    },

    /**
     * Check if email exists
     * @param email Email to check
     */
    async checkEmailExists(
        email: string,
    ): Promise<ApiResponse<CheckExistsResponse>> {
        return apiClient.get<CheckExistsResponse>(
            AUTH_ENDPOINTS.CHECK_EMAIL(email),
        );
    },
};
