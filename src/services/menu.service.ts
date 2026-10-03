import { apiClient } from '@/lib/api-client';
import { MENU_ENDPOINTS } from '@/lib/api-endpoints';
import dummyMenu from '@/data/dummy-menu.json';
import type { ApiResponse, NavbarItem } from '@/types';

export const MenuService = {
    /**
     * Lấy danh sách menu phân cấp hệ thống từ API Gateway
     * @param group Tùy chọn lọc theo nhóm menu
     */
    getMenu: async (group?: string): Promise<ApiResponse<NavbarItem[]>> => {
        try {
            const response = await apiClient.get<NavbarItem[]>(MENU_ENDPOINTS.LIST, {
                params: group ? { group } : undefined,
            });
            if (response?.data) {
                return response;
            }
            return {
                returnCode: 0,
                message: 'Thành công (fallback dummy JSON)',
                errors: [],
                data: dummyMenu as NavbarItem[],
            };
        } catch {
            return {
                returnCode: 0,
                message: 'Thành công (fallback dummy JSON)',
                errors: [],
                data: dummyMenu as NavbarItem[],
            };
        }
    },

    /**
     * Lấy dữ liệu menu mẫu từ dummy JSON (đồng bộ)
     */
    getDummyMenu: (): NavbarItem[] => {
        return dummyMenu as NavbarItem[];
    },
};

export default MenuService;
