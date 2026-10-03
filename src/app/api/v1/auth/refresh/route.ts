import { successResponse } from "@/lib/api-response-helper";

export async function POST() {
    const refreshed = {
        accessToken: `refreshed-mock-jwt-token-${Date.now()}`,
        refreshToken: `refreshed-mock-refresh-token-${Date.now()}`,
    };
    return successResponse(refreshed, "Làm mới phiên thành công");
}
