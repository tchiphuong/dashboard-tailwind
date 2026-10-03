import { BaseEntity, BaseQueryParams } from "./api";

export interface Position extends BaseEntity {
    id: number;
    positionCode: string;
    positionName: string;
    description?: string;
    level?: number;
}

export interface PositionListParams extends BaseQueryParams {
    status?: number;
    level?: number;
}

export type CreatePositionDto = Partial<Omit<Position, "id" | "createdAt" | "updatedAt">>;
export type UpdatePositionDto = Partial<Omit<Position, "id" | "createdAt" | "updatedAt">>;
