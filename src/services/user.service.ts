import { apiClient } from "@/lib/api-client";
import { USER_ENDPOINTS } from "@/lib/api-endpoints";
import { ApiResponse, ICrudService, PagedResponse, PagedResult, User, UserListParams } from "@/types";

export const UserService: ICrudService<User, UserListParams> = {
    list: async (params: UserListParams): Promise<PagedResponse<User>> => {
        const response = await apiClient.get<PagedResult<User>>(
            USER_ENDPOINTS.LIST,
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

    get: async (id: number | string): Promise<ApiResponse<User>> => {
        const response = await apiClient.get<User>(USER_ENDPOINTS.DETAIL(id));
        return response as ApiResponse<User>;
    },

    create: async (data: Partial<User>): Promise<ApiResponse<number>> => {
        const response = await apiClient.post<number>(
            USER_ENDPOINTS.CREATE,
            data,
        );
        return response as ApiResponse<number>;
    },

    update: async (
        id: number | string,
        data: Partial<User>,
    ): Promise<ApiResponse<void>> => {
        const response = await apiClient.put<void>(
            USER_ENDPOINTS.UPDATE(id),
            data,
        );
        return response as ApiResponse<void>;
    },

    delete: async (ids: (number | string)[]): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<void>(USER_ENDPOINTS.DELETE, {
            data: ids,
        });
        return response as ApiResponse<void>;
    },
};

export type { User, UserListParams };
