import { BaseEntity, BaseQueryParams } from './api';

export interface User extends BaseEntity {
    id: number;
    username: string;
    displayName: string;
    avatar?: string;
    image?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    company?: {
        name: string;
        department?: string;
        title?: string;
    };
    address?: {
        city: string;
        country?: string;
    };
}

export interface UserListParams extends BaseQueryParams {
    role?: string;
    departmentId?: number | string;
}

export type CreateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
export type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
