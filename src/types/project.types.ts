import type { BaseEntity, PagingParams } from './api';

export interface ProjectItem extends BaseEntity {
    id: string | number;
    code: string;
    name: string;
    leader: string;
    budget: number;
    progress: number;
    startDate: string;
    endDate: string;
    status: 'in_progress' | 'completed' | 'on_hold' | 'planning';
    teamSize?: number;
    description?: string;
}

export interface ProjectStatusOption {
    id: string;
    label: string;
}

export interface ProjectListParams extends Partial<PagingParams> {
    status?: string;
    search?: string;
}

export interface CreateProjectDto {
    code: string;
    name: string;
    leader: string;
    budget: number;
    progress: number;
    startDate: string;
    endDate: string;
    status: 'in_progress' | 'completed' | 'on_hold' | 'planning';
    description?: string;
}
