import { apiClient } from "@/lib/api-client";
import { ApiResponse, PagedResponse, PagedResult } from "@/types";
import {
    CreateUserPayload,
    UpdateUserPayload,
    UserDetailModel,
    UserListParams,
    UserModel,
} from "@/types/system";

const BASE_PATH = "/api/v1/users";

export const userService = {
    /**
     * Get user list (with pagination & filters)
     */
    getUsers: async (
        params: UserListParams,
    ): Promise<PagedResponse<UserModel>> => {
        return apiClient.get<PagedResult<UserModel>>(BASE_PATH, { params });
    },

    /**
     * Get user details by UUID
     */
    getUserById: async (
        uuid: string,
    ): Promise<ApiResponse<UserDetailModel>> => {
        return apiClient.get<UserDetailModel>(`${BASE_PATH}/${uuid}`);
    },

    /**
     * Create a new user
     */
    createUser: async (
        payload: CreateUserPayload,
    ): Promise<ApiResponse<{ uuid: string }>> => {
        return apiClient.post<{ uuid: string }>(BASE_PATH, payload);
    },

    /**
     * Update user information
     */
    updateUser: async (
        uuid: string,
        payload: UpdateUserPayload,
    ): Promise<ApiResponse<{ uuid: string }>> => {
        return apiClient.put<{ uuid: string }>(`${BASE_PATH}/${uuid}`, payload);
    },

    /**
     * Delete multiple users (soft delete)
     */
    deleteUsers: async (uuids: string[]): Promise<ApiResponse<boolean>> => {
        // Axios delete method takes data inside config object
        return apiClient.delete<boolean>(BASE_PATH, { data: uuids });
    },
};
