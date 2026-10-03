import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Role } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const role: Role = {
        id: Number(id) || 1,
        roleCode: `ROLE_${id}`,
        roleName: `Vai trò số ${id}`,
        description: `Mô tả chi tiết cho vai trò số ${id}`,
        isActive: 1,
    };
    return successResponse(role, "Lấy thông tin vai trò thành công");
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        return successResponse({ id: Number(id), ...body }, "Cập nhật vai trò thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật vai trò thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa vai trò thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa vai trò thất bại";
        return errorResponse(message, [message], 400);
    }
}
