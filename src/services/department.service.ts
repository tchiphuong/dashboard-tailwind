import { apiClient } from "@/lib/api-client";
import { DEPARTMENT_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse, Department, DepartmentListParams, PagedResponse, PagedResult } from "@/types";

export const DepartmentService = {
    list: async (
        params: DepartmentListParams,
    ): Promise<PagedResponse<Department>> => {
        const response = await apiClient.get<PagedResult<Department>>(
            DEPARTMENT_ENDPOINTS.LIST,
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

    get: async (id: number | string): Promise<ApiResponse<Department>> => {
        const response = await apiClient.get<Department>(
            DEPARTMENT_ENDPOINTS.DETAIL(id),
        );
        return response as ApiResponse<Department>;
    },

    create: async (
        data: Partial<Department>,
    ): Promise<ApiResponse<{ id: number }>> => {
        const response = await apiClient.post<{ id: number }>(
            DEPARTMENT_ENDPOINTS.CREATE,
            data,
        );
        return response as ApiResponse<{ id: number }>;
    },

    update: async (
        id: number | string,
        data: Partial<Department>,
    ): Promise<ApiResponse<void>> => {
        const response = await apiClient.put<void>(
            DEPARTMENT_ENDPOINTS.UPDATE(id),
            data,
        );
        return response as ApiResponse<void>;
    },

    delete: async (ids: (number | string)[]): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<void>(
            DEPARTMENT_ENDPOINTS.DELETE,
            {
                data: ids,
            },
        );
        return response as ApiResponse<void>;
    },

    getCombobox: async (
        keyword?: string,
    ): Promise<ApiResponse<Record<string, unknown>[]>> => {
        const response = await apiClient.get<Record<string, unknown>[]>(
            DEPARTMENT_ENDPOINTS.COMBOBOX,
            {
                params: { keyword },
            },
        );
        return response as ApiResponse<Record<string, unknown>[]>;
    },
};

export type { Department, DepartmentListParams };
