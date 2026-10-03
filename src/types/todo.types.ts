import type { BaseEntity, BaseQueryParams } from "./api";

export interface Todo extends BaseEntity {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

export interface TodoListParams extends BaseQueryParams {
    completed?: boolean;
    userId?: number;
}

export type CreateTodoDto = Omit<Todo, "id" | "createdAt" | "updatedAt">;
export type UpdateTodoDto = Partial<CreateTodoDto>;
