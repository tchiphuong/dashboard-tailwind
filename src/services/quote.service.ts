import { apiClient } from "@/lib/api-client";
import { QUOTE_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse, PagedResponse, PagedResult } from "@/types/api";
import type { Quote, QuoteListParams } from "@/types/quote.types";

export const QuoteService = {
    list: async (params?: QuoteListParams): Promise<PagedResponse<Quote>> => {
        const response = await apiClient.get<PagedResult<Quote>>(QUOTE_ENDPOINTS.LIST, {
            params,
        });
        return response;
    },

    getRandom: async (): Promise<ApiResponse<Quote>> => {
        const response = await apiClient.get<Quote>(QUOTE_ENDPOINTS.RANDOM);
        return response;
    },

    get: async (id: number | string): Promise<ApiResponse<Quote>> => {
        const response = await apiClient.get<Quote>(QUOTE_ENDPOINTS.DETAIL(id));
        return response;
    },
};

export type { Quote, QuoteListParams };
