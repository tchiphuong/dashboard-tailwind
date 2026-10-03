import type { BaseEntity, PagingParams } from './api';

export interface AuditLogItem extends BaseEntity {
    id: string;
    timestamp: string;
    userName: string;
    action: string;
    module: string;
    ipAddress: string;
    status: 'success' | 'warning' | 'danger';
    details: string;
    city?: string;
    country?: string;
    userEmail?: string;
    role?: string;
    location?: string;
    device?: string;
}

export interface AuditLogListParams extends Partial<PagingParams> {
    module?: string;
    status?: string;
    search?: string;
}
