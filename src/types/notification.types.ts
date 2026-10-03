import type { BaseEntity, PagingParams } from './api';

export interface NotificationItem extends BaseEntity {
    id: string;
    title: string;
    description: string;
    category: 'sales' | 'finance' | 'system' | 'general';
    time: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
}

export interface NotificationListParams extends Partial<PagingParams> {
    category?: string;
    isRead?: boolean;
}
