import { AuditEntity, BaseQueryParams } from "./api";

export interface Role extends AuditEntity {
    id: number;
    roleCode: string;
    roleName: string;
    description?: string;
    isActive: number;
    dataRowVersion?: string;
    userCount?: number;
    isSystem?: boolean;
}

export interface RoleListParams extends BaseQueryParams {
    isActive?: number;
}

export type CreateRoleDto = Partial<Omit<Role, "id" | "createdAt" | "updatedAt">>;
export type UpdateRoleDto = Partial<Omit<Role, "id" | "createdAt" | "updatedAt">>;
