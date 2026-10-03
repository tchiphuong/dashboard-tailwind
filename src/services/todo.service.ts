import { apiClient } from "@/lib/api-client";
import { TODO_ENDPOINTS } from "@/lib/api-endpoints";
import type { ApiResponse, ICrudService, PagedResponse, PagedResult } from "@/types/api";
import type { CreateTodoDto, Todo, TodoListParams, UpdateTodoDto } from "@/types/todo.types";

export const TodoService: ICrudService<Todo, TodoListParams, CreateTodoDto, UpdateTodoDto> = {
    list: async (params?: TodoListParams): Promise<PagedResponse<Todo>> => {
        const response = await apiClient.get<PagedResult<Todo>>(TODO_ENDPOINTS.LIST, {
            params,
        });
        return response;
    },

    get: async (id: number | string): Promise<ApiResponse<Todo>> => {
        const response = await apiClient.get<Todo>(TODO_ENDPOINTS.DETAIL(id));
        return response;
    },

    create: async (data: CreateTodoDto): Promise<ApiResponse<number>> => {
        const response = await apiClient.post<number>(TODO_ENDPOINTS.CREATE, data);
        return response;
    },

    update: async (id: number | string, data: UpdateTodoDto): Promise<ApiResponse<void>> => {
        const response = await apiClient.put<void>(TODO_ENDPOINTS.UPDATE(id), data);
        return response;
    },

    delete: async (ids: (number | string)[]): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete<void>(TODO_ENDPOINTS.DELETE, {
            data: ids,
        });
        return response;
    },
};

export type { Todo, TodoListParams, CreateTodoDto, UpdateTodoDto };
