import { BaseEntity, BaseQueryParams } from "./api";

export interface Product extends BaseEntity {
    id: number;
    title: string;
    price: number;
    rating: number;
    stock: number;
    name?: string;
    brand?: string;
    discountPercentage?: number;
    sales?: number;
    revenue?: number;
    growth?: number;
    category?: string;
    description?: string;
    thumbnail?: string;
}

export interface ProductListParams extends BaseQueryParams {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}

export type CreateProductDto = Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;
export type UpdateProductDto = Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>;
