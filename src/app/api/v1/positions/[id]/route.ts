import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Position } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const pos: Position = {
        id: Number(id) || 1,
        positionCode: `POS_${id}`,
        positionName: `Chức vụ số ${id}`,
        level: 3,
        description: `Mô tả chi tiết chức vụ ${id}`,
    };
    return successResponse(pos, "Lấy thông tin chức vụ thành công");
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        return successResponse({ id: Number(id), ...body }, "Cập nhật chức vụ thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật chức vụ thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa chức vụ thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa chức vụ thất bại";
        return errorResponse(message, [message], 400);
    }
}
