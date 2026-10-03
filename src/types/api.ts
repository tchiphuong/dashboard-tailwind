/**
 * API Response & Common Entity Models
 * Theo chuẩn UniManage Backend ASP.NET Core
 */

export interface ApiResponse<T = unknown> {
    returnCode: number;
    message: string;
    data?: T;
    errors: (string | FieldErrorModel)[];
}

export interface PagingInfo {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface PagedResult<T> {
    items: T[];
    paging: PagingInfo;
}

export type PagedResponse<T> = ApiResponse<PagedResult<T>>;

export interface FieldErrorModel {
    field: string;
    messages: string[];
}

export interface PagingParams {
    pageIndex: number;
    pageSize: number;
    [key: string]: unknown;
}

/**
 * Base Entity - Dùng chung cho mọi đối tượng có ID và timestamp
 */
export interface BaseEntity {
    id: number | string;
    createdAt?: string;
    updatedAt?: string;
    status?: string | number;
}

/**
 * Audit Entity - Dành cho các entity có lịch sử người tạo / cập nhật
 */
export interface AuditEntity extends BaseEntity {
    createdBy?: string;
    updatedBy?: string;
    isDeleted?: boolean;
}

/**
 * BaseQueryParams - Dùng chung cho toàn bộ tham số filter, search, sort của các Service
 */
export interface BaseQueryParams extends PagingParams {
    keyword?: string;
    status?: string | number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    fromDate?: string;
    toDate?: string;
}

/**
 * ICrudService - Chuẩn giao tiếp CRUD thống nhất cho toàn bộ các Service
 */
export interface ICrudService<
    T,
    TParams extends BaseQueryParams = BaseQueryParams,
    TCreate = Partial<T>,
    TUpdate = Partial<T>,
> {
    list(params: TParams): Promise<PagedResponse<T>>;
    get(id: number | string): Promise<ApiResponse<T>>;
    create(data: TCreate): Promise<ApiResponse<number | string | T>>;
    update(id: number | string, data: TUpdate): Promise<ApiResponse<void>>;
    delete(ids: (number | string)[]): Promise<ApiResponse<void>>;
}
