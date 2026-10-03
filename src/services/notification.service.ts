import { apiClient } from '@/lib/api-client';
import { NOTIFICATION_ENDPOINTS } from '@/lib/api-endpoints';
import type {
    NotificationItem,
    NotificationListParams,
    ApiResponse,
} from '@/types';

export const NotificationService = {
    /**
     * Lấy danh sách thông báo
     */
    async getNotifications(params?: NotificationListParams): Promise<ApiResponse<NotificationItem[]>> {
        return apiClient.get<NotificationItem[]>(NOTIFICATION_ENDPOINTS.LIST, {
            params,
        });
    },

    /**
     * Đánh dấu 1 thông báo là đã đọc
     */
    async markAsRead(id: string): Promise<ApiResponse<NotificationItem[]>> {
        return apiClient.patch<NotificationItem[]>(NOTIFICATION_ENDPOINTS.LIST, {
            action: 'mark_read',
            id,
        });
    },

    /**
     * Đánh dấu toàn bộ là đã đọc
     */
    async markAllAsRead(): Promise<ApiResponse<NotificationItem[]>> {
        return apiClient.patch<NotificationItem[]>(NOTIFICATION_ENDPOINTS.LIST, {
            action: 'mark_all_read',
        });
    },

    /**
     * Xóa 1 thông báo
     */
    async deleteNotification(id: string): Promise<ApiResponse<NotificationItem[]>> {
        return apiClient.patch<NotificationItem[]>(NOTIFICATION_ENDPOINTS.LIST, {
            action: 'delete',
            id,
        });
    },
};
