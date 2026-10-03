import type { BaseEntity, BaseQueryParams } from "./api";

export interface Quote extends BaseEntity {
    id: number;
    quote: string;
    author: string;
}

export interface QuoteListParams extends BaseQueryParams {
    author?: string;
}
