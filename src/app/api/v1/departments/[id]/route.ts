import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";
import type { Department } from "@/types";

interface RouteParams {
    params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
    const { id } = await params;
    const dept: Department = {
        id: Number(id) || 1,
        departmentCode: `DEPT_${id}`,
        departmentName: `Phòng ban số ${id}`,
        managerName: "Trưởng phòng phụ trách",
        employeeCount: 10,
    };
    return successResponse(dept, "Lấy thông tin phòng ban thành công");
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const body = await req.json().catch(() => ({}));
        return successResponse({ id: Number(id), ...body }, "Cập nhật phòng ban thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật phòng ban thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        return successResponse({ id: Number(id) }, "Xóa phòng ban thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa phòng ban thất bại";
        return errorResponse(message, [message], 400);
    }
}
