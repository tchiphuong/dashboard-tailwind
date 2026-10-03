import type { BaseEntity, PagingParams } from './api';

export interface AssetItem extends BaseEntity {
    id: string | number;
    code: string;
    name: string;
    category: string;
    assignedTo: string;
    department: string;
    value: number;
    status: 'in_use' | 'available' | 'maintenance';
    brand?: string;
    thumbnail?: string;
}

export interface AssetRequestItem extends BaseEntity {
    id: string;
    requesterName: string;
    department: string;
    assetType: string;
    reason: string;
    requestDate: string;
    status: 'pending' | 'approved' | 'rejected';
}

export interface AssetListParams extends Partial<PagingParams> {
    category?: string;
    status?: string;
    search?: string;
}

export interface CreateAssetDto {
    code: string;
    name: string;
    category: string;
    assignedTo?: string;
    department?: string;
    value: number;
    status: 'in_use' | 'available' | 'maintenance';
}
