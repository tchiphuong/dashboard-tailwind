import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { Todo } from "@/types";

interface DummyTodoResponse {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
        const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
        const skip = (pageIndex - 1) * pageSize;

        const res = await fetch(`https://dummyjson.com/todos?limit=${pageSize}&skip=${skip}`, {
            headers: { Accept: "application/json" },
            next: { revalidate: 30 },
        });

        if (!res.ok) {
            throw new Error(`Lỗi từ public todos API: ${res.status}`);
        }

        const json = await res.json();
        const items: Todo[] = (json.todos || []).map((t: DummyTodoResponse) => ({
            id: t.id,
            todo: t.todo,
            completed: t.completed,
            userId: t.userId,
            status: t.completed ? "Completed" : "Pending",
            createdAt: new Date().toISOString(),
        }));

        const totalItems = json.total || items.length;
        const totalPages = Math.ceil(totalItems / pageSize);

        return pagedSuccessResponse<Todo>(items, {
            pageIndex,
            pageSize,
            totalItems,
            totalPages,
        });
    } catch {
        const fallbackTodos: Todo[] = [
            { id: 1, todo: "Kiểm tra hệ thống CI/CD", completed: true, userId: 1, status: "Completed" },
            { id: 2, todo: "Tối ưu hóa chỉ mục cơ sở dữ liệu", completed: false, userId: 1, status: "Pending" },
            { id: 3, todo: "Xem xét báo cáo tài chính quý 1", completed: false, userId: 2, status: "Pending" },
        ];

        return pagedSuccessResponse<Todo>(fallbackTodos, {
            pageIndex: 1,
            pageSize: 10,
            totalItems: fallbackTodos.length,
            totalPages: 1,
        });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const newId = Date.now();
        return successResponse({ id: newId, ...body }, "Tạo công việc mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo công việc thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse({ deleted: body?.ids || [] }, "Xóa công việc thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa công việc thất bại";
        return errorResponse(message, [message], 400);
    }
}
