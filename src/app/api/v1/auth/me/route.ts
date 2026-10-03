import { successResponse } from "@/lib/api-response-helper";

export async function GET() {
    // Trả về thông tin người dùng hiện tại
    const userData = {
        id: 1,
        username: "admin",
        displayName: "Quản trị viên Hệ thống",
        email: "admin@unimanage.vn",
        role: "Admin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
        department: "Khối Công nghệ & Vận hành",
        position: "Giám đốc Kỹ thuật (CTO)",
    };

    return successResponse(userData, "Lấy thông tin người dùng thành công");
}
