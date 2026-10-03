import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api-response-helper";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const username = body?.username || "admin";

        // Trả về mock token và user info chuẩn để tương thích với auth flow
        const authData = {
            accessToken: `mock-jwt-token-${Date.now()}`,
            refreshToken: `mock-refresh-token-${Date.now()}`,
            expiresIn: 86400,
            user: {
                id: 1,
                username,
                displayName: username === "admin" ? "Quản trị viên Hệ thống" : username,
                email: `${username}@unimanage.vn`,
                role: username === "admin" ? "Admin" : "Employee",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            },
        };

        return successResponse(authData, "Đăng nhập thành công");
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
        return errorResponse(message, [message], 500);
    }
}
