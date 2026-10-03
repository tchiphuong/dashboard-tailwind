import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { Role } from "@/types";

const mockRoles: Role[] = [
    { id: 1, roleCode: "SUPER_ADMIN", roleName: "Quản trị cấp cao", description: "Toàn quyền quản trị trên toàn bộ hệ thống", isActive: 1, userCount: 2, isSystem: true, createdAt: "2024-01-01T00:00:00Z" },
    { id: 2, roleCode: "ADMIN", roleName: "Quản trị viên", description: "Quản lý người dùng, phân quyền và cấu hình hệ thống", isActive: 1, userCount: 5, isSystem: true, createdAt: "2024-01-05T00:00:00Z" },
    { id: 3, roleCode: "DEPT_MANAGER", roleName: "Trưởng phòng ban", description: "Xem báo cáo và phê duyệt hồ sơ trong phòng ban", isActive: 1, userCount: 12, isSystem: false, createdAt: "2024-01-10T00:00:00Z" },
    { id: 4, roleCode: "STAFF", roleName: "Nhân viên vận hành", description: "Thực hiện các tác vụ nghiệp vụ hàng ngày", isActive: 1, userCount: 84, isSystem: false, createdAt: "2024-02-01T00:00:00Z" },
    { id: 5, roleCode: "AUDITOR", roleName: "Kiểm toán viên", description: "Chỉ có quyền xem các nhật ký và báo cáo đối soát", isActive: 1, userCount: 3, isSystem: false, createdAt: "2024-03-01T00:00:00Z" },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const keyword = searchParams.get("keyword")?.toLowerCase() || "";

    const filtered = mockRoles.filter((r) =>
        !keyword || r.roleName.toLowerCase().includes(keyword) || r.roleCode.toLowerCase().includes(keyword)
    );

    const start = (pageIndex - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return pagedSuccessResponse<Role>(items, {
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
        return successResponse({ id: newId, ...body }, "Tạo vai trò mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo vai trò thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse({ deleted: body?.ids || [] }, "Xóa vai trò thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa vai trò thất bại";
        return errorResponse(message, [message], 400);
    }
}
