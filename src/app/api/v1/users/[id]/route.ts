import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { User } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const res = await fetch(`https://dummyjson.com/users/${id}`, {
            headers: { Accept: "application/json" },
        });

        if (res.ok) {
            const u = await res.json();
            const user: User = {
                id: u.id,
                username: u.username,
                displayName: `${u.firstName} ${u.lastName}`,
                email: u.email,
                phone: u.phone,
                avatar: u.image,
                role: u.role || "User",
                status: "Active",
                createdAt: new Date().toISOString(),
            };
            return successResponse(user, "Lấy thông tin người dùng thành công");
        }

        return successResponse<User>({
            id: Number(id) || 1,
            username: `user_${id}`,
            displayName: `Người dùng ${id}`,
            email: `user${id}@unimanage.vn`,
            role: "User",
            status: "Active",
        }, "Lấy thông tin người dùng thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi khi lấy thông tin người dùng";
        return errorResponse(message, [message], 404);
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        return successResponse({ id: Number(id), ...body }, "Cập nhật người dùng thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật người dùng thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa người dùng thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa người dùng thất bại";
        return errorResponse(message, [message], 400);
    }
}
