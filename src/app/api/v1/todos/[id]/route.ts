import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Todo } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const res = await fetch(`https://dummyjson.com/todos/${id}`, {
            headers: { Accept: "application/json" },
        });

        if (res.ok) {
            const t = await res.json();
            const todo: Todo = {
                id: t.id,
                todo: t.todo,
                completed: t.completed,
                userId: t.userId,
                status: t.completed ? "Completed" : "Pending",
            };
            return successResponse(todo, "Lấy thông tin công việc thành công");
        }

        return successResponse<Todo>({
            id: Number(id) || 1,
            todo: `Công việc số ${id}`,
            completed: false,
            userId: 1,
            status: "Pending",
        }, "Lấy thông tin công việc thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi khi lấy thông tin công việc";
        return errorResponse(message, [message], 404);
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        return successResponse({ id: Number(id), ...body }, "Cập nhật công việc thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật công việc thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa công việc thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa công việc thất bại";
        return errorResponse(message, [message], 400);
    }
}
