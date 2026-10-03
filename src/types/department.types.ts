import { BaseEntity, BaseQueryParams } from "./api";

export interface Department extends BaseEntity {
    id: number;
    departmentCode: string;
    departmentName: string;
    description?: string;
    managerName?: string;
    employeeCount?: number;
}

export interface DepartmentListParams extends BaseQueryParams {
    status?: number;
}

export type CreateDepartmentDto = Partial<Omit<Department, "id" | "createdAt" | "updatedAt">>;
export type UpdateDepartmentDto = Partial<Omit<Department, "id" | "createdAt" | "updatedAt">>;
