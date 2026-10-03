import { apiClient } from "@/lib/api-client";
import { COMMENT_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse, PagedResponse, PagedResult } from "@/types/api";
import type { Comment, CommentListParams } from "@/types/comment.types";

export const CommentService = {
    list: async (params?: CommentListParams): Promise<PagedResponse<Comment>> => {
        const response = await apiClient.get<PagedResult<Comment>>(COMMENT_ENDPOINTS.LIST, {
            params,
        });
        return response;
    },

    get: async (id: number | string): Promise<ApiResponse<Comment>> => {
        const response = await apiClient.get<Comment>(COMMENT_ENDPOINTS.DETAIL(id));
        return response;
    },
};

export type { Comment, CommentListParams };
