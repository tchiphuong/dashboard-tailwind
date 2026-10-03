import { apiClient } from "@/lib/api-client";
import { POST_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse, PagedResponse, PagedResult } from "@/types/api";
import type { PostItem, PostListParams, CreatePostDto } from "@/types/post.types";

export const PostService = {
    list: async (params?: PostListParams): Promise<PagedResponse<PostItem>> => {
        const response = await apiClient.get<PagedResult<PostItem>>(POST_ENDPOINTS.LIST, {
            params,
        });
        return response;
    },

    get: async (id: number | string): Promise<ApiResponse<PostItem>> => {
        const response = await apiClient.get<PostItem>(POST_ENDPOINTS.DETAIL(id));
        return response;
    },

    create: async (data: CreatePostDto): Promise<ApiResponse<PostItem>> => {
        const response = await apiClient.post<PostItem>(POST_ENDPOINTS.CREATE, data);
        return response;
    },

    delete: async (id: number | string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<void>(`${POST_ENDPOINTS.DELETE}/${id}`);
        return response;
    },
};

export type { PostItem, PostListParams, CreatePostDto };
