import { PagingParams } from "./api";

/**
 * Model returned from User list API
 */
export interface UserModel {
    id: number;
    uuid: string;
    username: string;
    employeeCode: string;
    roleCode: string;
    status: string;
    createdAt: string;
}

/**
 * Model returned when fetching a single User detail
 */
export interface UserDetailModel extends UserModel {
    email: string;
    rowVersion: string;
}

/**
 * Payload to create a new User
 */
export interface CreateUserPayload {
    username: string;
    email: string;
    employeeCode?: string;
    status: string;
    roleCodes?: string[];
    password?: string;
}

/**
 * Payload to update an existing User
 */
export interface UpdateUserPayload {
    email: string;
    employeeCode?: string;
    status: string;
    rowVersion: string;
}

/**
 * Parameters used to filter the User list
 */
export interface UserListParams extends PagingParams {
    keyword?: string;
    status?: string;
}
