import type { BaseEntity, PagingParams } from './api';

export interface PostItem extends BaseEntity {
    id: number | string;
    title: string;
    slug: string;
    author: string;
    category: string;
    body?: string;
    tags?: string[];
    views: number;
    publishDate: string;
    status: 'published' | 'draft' | 'archived';
}

export interface PostListParams extends Partial<PagingParams> {
    category?: string;
    status?: string;
    search?: string;
}

export interface CreatePostDto {
    title: string;
    category: string;
    body: string;
    status?: 'published' | 'draft';
}
