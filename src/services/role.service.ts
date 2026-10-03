import { apiClient } from "@/lib/api-client";
import { ROLE_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse, PagedResponse, PagedResult, Role, RoleListParams } from "@/types";

export const RoleService = {
    list: async (params: RoleListParams): Promise<PagedResponse<Role>> => {
        const response = await apiClient.get<PagedResult<Role>>(
            ROLE_ENDPOINTS.LIST,
            { params },
        );
        return (
            response || {
                returnCode: -1,
                message: "Error",
                errors: [],
                data: {
                    items: [],
                    paging: {
                        pageIndex: 1,
                        pageSize: 20,
                        totalItems: 0,
                        totalPages: 0,
                    },
                },
            }
        );
    },

    getByCode: async (code: string): Promise<ApiResponse<Role>> => {
        const response = await apiClient.get<Role>(
            `${ROLE_ENDPOINTS.LIST}/${code}`,
        );
        return response as ApiResponse<Role>;
    },

    create: async (
        data: Partial<Role>,
    ): Promise<ApiResponse<{ id: number }>> => {
        const response = await apiClient.post<{ id: number }>(
            ROLE_ENDPOINTS.CREATE,
            data,
        );
        return response as ApiResponse<{ id: number }>;
    },

    update: async (
        code: string,
        data: Partial<Role>,
    ): Promise<ApiResponse<{ success: boolean }>> => {
        const response = await apiClient.put<{ success: boolean }>(
            `${ROLE_ENDPOINTS.LIST}/${code}`,
            data,
        );
        return response as ApiResponse<{ success: boolean }>;
    },

    delete: async (
        roleCodes: string[],
    ): Promise<ApiResponse<{ success: boolean }>> => {
        const response = await apiClient.delete<{ success: boolean }>(
            ROLE_ENDPOINTS.DELETE,
            {
                data: { roleCodes },
            },
        );
        return response as ApiResponse<{ success: boolean }>;
    },

    getCombobox: async (
        keyword?: string,
    ): Promise<ApiResponse<Record<string, unknown>[]>> => {
        const response = await apiClient.get<Record<string, unknown>[]>(
            ROLE_ENDPOINTS.COMBOBOX,
            {
                params: { keyword },
            },
        );
        return response as ApiResponse<Record<string, unknown>[]>;
    },
};

export type { Role, RoleListParams };
