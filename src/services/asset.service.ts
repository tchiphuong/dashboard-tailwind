import { apiClient } from '@/lib/api-client';
import { ASSET_ENDPOINTS } from '@/lib/api-endpoints';
import type {
    AssetItem,
    AssetRequestItem,
    AssetListParams,
    CreateAssetDto,
    ApiResponse,
    PagedResponse,
    PagedResult,
} from '@/types';

export const AssetService = {
    /**
     * Lấy danh sách tài sản có phân trang và bộ lọc
     */
    async getAssets(params?: AssetListParams): Promise<PagedResponse<AssetItem>> {
        return apiClient.get<PagedResult<AssetItem>>(ASSET_ENDPOINTS.LIST, {
            params,
        });
    },

    /**
     * Thêm mới tài sản
     */
    async createAsset(data: CreateAssetDto): Promise<ApiResponse<AssetItem>> {
        return apiClient.post<AssetItem>(ASSET_ENDPOINTS.CREATE, data);
    },

    /**
     * Lấy danh sách yêu cầu cấp phát tài sản
     */
    async getRequests(): Promise<ApiResponse<AssetRequestItem[]>> {
        return apiClient.get<AssetRequestItem[]>(ASSET_ENDPOINTS.REQUESTS);
    },

    /**
     * Cập nhật trạng thái duyệt / từ chối yêu cầu cấp phát
     */
    async updateRequestStatus(
        id: string,
        status: 'approved' | 'rejected'
    ): Promise<ApiResponse<AssetRequestItem>> {
        return apiClient.patch<AssetRequestItem>(ASSET_ENDPOINTS.REQUESTS, { id, status });
    },
};
