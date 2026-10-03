import { apiClient } from "@/lib/api-client";
import { POSITION_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse, PagedResponse, PagedResult, Position, PositionListParams } from "@/types";

export const PositionService = {
    list: async (
        params: PositionListParams,
    ): Promise<PagedResponse<Position>> => {
        const response = await apiClient.get<PagedResult<Position>>(
            POSITION_ENDPOINTS.LIST,
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

    get: async (id: number | string): Promise<ApiResponse<Position>> => {
        const response = await apiClient.get<Position>(
            POSITION_ENDPOINTS.DETAIL(id),
        );
        return response as ApiResponse<Position>;
    },

    create: async (
        data: Partial<Position>,
    ): Promise<ApiResponse<{ id: number }>> => {
        const response = await apiClient.post<{ id: number }>(
            POSITION_ENDPOINTS.CREATE,
            data,
        );
        return response as ApiResponse<{ id: number }>;
    },

    update: async (
        id: number | string,
        data: Partial<Position>,
    ): Promise<ApiResponse<void>> => {
        const response = await apiClient.put<void>(
            POSITION_ENDPOINTS.UPDATE(id),
            data,
        );
        return response as ApiResponse<void>;
    },

    delete: async (ids: (number | string)[]): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<void>(
            POSITION_ENDPOINTS.DELETE,
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
            POSITION_ENDPOINTS.COMBOBOX,
            {
                params: { keyword },
            },
        );
        return response as ApiResponse<Record<string, unknown>[]>;
    },
};

export type { Position, PositionListParams };
