import { NextRequest } from "next/server";

import { errorResponse, pagedSuccessResponse, successResponse } from "@/lib/api-response-helper";
import type { Department } from "@/types";

const mockDepartments: Department[] = [
    { id: 1, departmentCode: "IT", departmentName: "Khối Công nghệ & Phần mềm", managerName: "Nguyễn Văn An", employeeCount: 42, description: "Phụ trách phát triển giải pháp phần mềm và hạ tầng số" },
    { id: 2, departmentCode: "HR", departmentName: "Phòng Nhân sự & Đào tạo", managerName: "Trần Thị Mai", employeeCount: 15, description: "Quản lý tuyển dụng, chế độ đãi ngộ và phát triển nhân tài" },
    { id: 3, departmentCode: "FIN", departmentName: "Phòng Tài chính - Kế toán", managerName: "Lê Hoàng Phúc", employeeCount: 12, description: "Quản lý dòng tiền, quyết toán và báo cáo thuế" },
    { id: 4, departmentCode: "SALES", departmentName: "Khối Kinh doanh & Khách hàng", managerName: "Phạm Quốc Bảo", employeeCount: 58, description: "Mở rộng thị trường, chăm sóc khách hàng và bán hàng B2B" },
    { id: 5, departmentCode: "MKT", departmentName: "Phòng Marketing & Truyền thông", managerName: "Đỗ Kim Ngân", employeeCount: 20, description: "Xây dựng thương hiệu và các chiến dịch quảng bá số" },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 10);
    const keyword = searchParams.get("keyword")?.toLowerCase() || "";

    const filtered = mockDepartments.filter((d) =>
        !keyword || d.departmentName.toLowerCase().includes(keyword) || d.departmentCode.toLowerCase().includes(keyword)
    );

    const start = (pageIndex - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return pagedSuccessResponse<Department>(items, {
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
        return successResponse({ id: newId, ...body }, "Tạo phòng ban mới thành công", 201);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Tạo phòng ban thất bại";
        return errorResponse(message, [message], 400);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse({ deleted: body?.ids || [] }, "Xóa phòng ban thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Xóa phòng ban thất bại";
        return errorResponse(message, [message], 400);
    }
}
