import { apiClient } from "@/lib/api-client";
import { ApiResponse, ICrudService, PagedResponse, PagedResult, Product, ProductListParams } from "@/types";

export const ProductService: ICrudService<Product, ProductListParams> = {
    list: async (params: ProductListParams): Promise<PagedResponse<Product>> => {
        try {
            const response = await apiClient.get<PagedResult<Product>>("/api/v1/products", {
                params,
            });
            return response;
        } catch {
            // Fallback lấy dữ liệu thật từ public API dummyjson nếu BE chưa deploy
            const pageIndex = Number(params?.pageIndex || 1);
            const pageSize = Number(params?.pageSize || 10);
            const skip = (pageIndex - 1) * pageSize;
            const search = params?.keyword ? `&q=${encodeURIComponent(params.keyword)}` : "";

            try {
                const res = await fetch(`https://dummyjson.com/products/search?limit=${pageSize}&skip=${skip}${search}`);
                if (res.ok) {
                    const data = await res.json();
                    interface DummyProductItem {
                        id: number;
                        title: string;
                        price: number;
                        rating: number;
                        stock: number;
                        discountPercentage?: number;
                    }
                    const items: Product[] = (data.products || []).map((p: DummyProductItem) => ({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        rating: p.rating,
                        stock: p.stock,
                        name: p.title,
                        sales: Math.floor(p.price * 12),
                        revenue: Math.floor(p.price * p.stock),
                        growth: p.discountPercentage || 0,
                    }));

                    return {
                        returnCode: 0,
                        message: "Success",
                        errors: [],
                        data: {
                            items,
                            paging: {
                                pageIndex,
                                pageSize,
                                totalItems: data.total || items.length,
                                totalPages: Math.ceil((data.total || items.length) / pageSize),
                            },
                        },
                    };
                }
            } catch {
                // Offline fallback
            }

            return {
                returnCode: 0,
                message: "Success",
                errors: [],
                data: {
                    items: [],
                    paging: { pageIndex: 1, pageSize: 10, totalItems: 0, totalPages: 0 },
                },
            };
        }
    },

    get: async (id: number | string): Promise<ApiResponse<Product>> => {
        return apiClient.get<Product>(`/api/v1/products/${id}`);
    },

    create: async (data: Partial<Product>): Promise<ApiResponse<number>> => {
        return apiClient.post<number>("/api/v1/products", data);
    },

    update: async (id: number | string, data: Partial<Product>): Promise<ApiResponse<void>> => {
        return apiClient.put<void>(`/api/v1/products/${id}`, data);
    },

    delete: async (ids: (number | string)[]): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>("/api/v1/products", { data: ids });
    },
};

export type { Product, ProductListParams };
