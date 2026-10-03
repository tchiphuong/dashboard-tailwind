import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";

export async function GET() {
    const settings = {
        siteName: "UniManage Enterprise",
        siteDescription: "Hệ thống quản trị doanh nghiệp toàn diện",
        adminEmail: "support@unimanage.vn",
        language: "vi",
        timezone: "Asia/Ho_Chi_Minh",
        enableTwoFactor: true,
        sessionTimeoutMinutes: 60,
        maintenanceMode: false,
    };

    return successResponse(settings, "Lấy cấu hình hệ thống thành công");
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse(body, "Cập nhật cấu hình hệ thống thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật cấu hình thất bại";
        return errorResponse(message, [message], 400);
    }
}
