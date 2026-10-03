import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { Position } from "@/types";

const mockPositions: Position[] = [
    { id: 1, positionCode: "DIR", positionName: "Giám đốc Khối", level: 1, description: "Cấp quản lý chiến lược cấp cao" },
    { id: 2, positionCode: "MGR", positionName: "Trưởng phòng", level: 2, description: "Quản lý và điều phối hoạt động phòng ban" },
    { id: 3, positionCode: "LEAD", positionName: "Trưởng nhóm kỹ thuật", level: 3, description: "Chỉ đạo chuyên môn và giải pháp" },
    { id: 4, positionCode: "SR", positionName: "Chuyên viên cao cấp (Senior)", level: 4, description: "Thực hiện các nhiệm vụ kỹ thuật phức tạp" },
    { id: 5, positionCode: "MID", positionName: "Chuyên viên (Middle)", level: 5, description: "Độc lập phụ trách các luồng nghiệp vụ" },
    { id: 6, positionCode: "JR", positionName: "Nhân viên (Junior)", level: 6, description: "Hỗ trợ và triển khai các nhiệm vụ cơ bản" },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const keyword = searchParams.get("keyword")?.toLowerCase() || "";

    const filtered = mockPositions.filter((p) =>
        !keyword || p.positionName.toLowerCase().includes(keyword) || p.positionCode.toLowerCase().includes(keyword)
    );

    const start = (pageIndex - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return pagedSuccessResponse<Position>(items, {
        pageIndex,
        pageSize,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
    });
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const newId = Date.now();
        return successResponse({ id: newId, ...body }, "Tạo chức vụ mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo chức vụ thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse({ deleted: body?.ids || [] }, "Xóa chức vụ thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa chức vụ thất bại";
        return errorResponse(message, [message], 400);
    }
}
