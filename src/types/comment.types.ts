import type { BaseEntity, BaseQueryParams } from "./api";

export interface CommentUser {
    id: number;
    username: string;
    fullName: string;
}

export interface Comment extends BaseEntity {
    id: number;
    body: string;
    postId: number;
    user: CommentUser;
}

export interface CommentListParams extends BaseQueryParams {
    postId?: number;
}
