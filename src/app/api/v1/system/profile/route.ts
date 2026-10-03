import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";

export async function GET() {
    const profile = {
        id: 1,
        username: "admin",
        fullName: "Quản trị viên Hệ thống",
        email: "admin@unimanage.vn",
        phone: "+84 908 123 456",
        address: "Quận 1, Thành phố Hồ Chí Minh, Việt Nam",
        bio: "Kỹ sư phần mềm chịu trách nhiệm quản trị hệ thống.",
        department: "Khối Công nghệ & Vận hành",
        position: "Giám đốc Kỹ thuật (CTO)",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    };

    return successResponse(profile, "Lấy thông tin tài khoản thành công");
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        return successResponse(body, "Cập nhật thông tin tài khoản thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Cập nhật tài khoản thất bại";
        return errorResponse(message, [message], 400);
    }
}
