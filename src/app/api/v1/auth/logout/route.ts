import { successResponse } from "@/lib/api-response-helper";

export async function POST() {
    return successResponse({ success: true }, "Đăng xuất thành công");
}
