import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response-helper";
import type { AuditLogItem } from "@/types";

const mockIp = (a: number, b: number, c: number, d: number) => [a, b, c, d].join('.');

export async function GET(_req: NextRequest) {
    let clientGeo = "TP. Hồ Chí Minh, VN (Viettel)";
    try {
        // Tận dụng Public API IP-API từ danh mục 1.563 APIs J2Team để định vị IP client
        const res = await fetch("https://ip-api.com/json/?fields=status,country,city,isp", {
            headers: { Accept: "application/json" },
            next: { revalidate: 300 },
        });

        if (res.ok) {
            const data = await res.json();
            if (data.status === "success") {
                clientGeo = `${data.city || "TP. Hồ Chí Minh"}, ${data.country || "VN"} (${data.isp || "FPT"})`;
            }
        }
    } catch {
        // Fallback default
    }

    const logs: AuditLogItem[] = [
        {
            id: "LOG-1092",
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            userName: "Nguyễn Văn Hùng",
            userEmail: "hung.nguyen@company.vn",
            role: "Quản trị viên",
            action: "Đổi mật khẩu người dùng",
            module: "System",
            ipAddress: mockIp(14, 225, 210, 45),
            location: clientGeo,
            device: "Chrome 128 / Windows 11",
            status: "success",
            details: "Đã cập nhật mật khẩu cho tài khoản user_2041 theo yêu cầu hỗ trợ.",
            createdAt: new Date().toISOString(),
        },
        {
            id: "LOG-1091",
            timestamp: new Date(Date.now() - 3600000).toISOString().slice(0, 19).replace('T', ' '),
            userName: "Lê Thị Thu Thảo",
            userEmail: "thao.le@company.vn",
            role: "Kế toán trưởng",
            action: "Xuất danh sách hóa đơn thuế",
            module: "Finance",
            ipAddress: mockIp(118, 69, 182, 12),
            location: "TP. Hồ Chí Minh, VN (FPT Telecom)",
            device: "Edge 128 / Windows 11",
            status: "success",
            details: "Xuất file Excel gồm 1.250 hóa đơn quý 3/2026.",
            createdAt: new Date().toISOString(),
        },
        {
            id: "LOG-1090",
            timestamp: new Date(Date.now() - 7200000).toISOString().slice(0, 19).replace('T', ' '),
            userName: "Unknown (Ẩn danh)",
            userEmail: "admin@company.vn",
            role: "Khách",
            action: "Đăng nhập sai mật khẩu 5 lần",
            module: "Auth",
            ipAddress: mockIp(45, 134, 140, 21),
            location: "Frankfurt, Đức (Hosting/VPN)",
            device: "Python-requests / Linux",
            status: "danger",
            details: "Phát hiện hành vi dò quét mật khẩu (brute-force). Hệ thống tự động khóa IP 30 phút.",
            createdAt: new Date().toISOString(),
        },
        {
            id: "LOG-1089",
            timestamp: new Date(Date.now() - 10800000).toISOString().slice(0, 19).replace('T', ' '),
            userName: "Trần Minh Tâm",
            userEmail: "tam.tran@company.vn",
            role: "Trưởng phòng Sales",
            action: "Phê duyệt chiết khấu đơn hàng #ORD-8821",
            module: "Sales",
            ipAddress: mockIp(42, 112, 35, 89),
            location: "Hà Nội, VN (VNPT)",
            device: "Safari / macOS Sonoma",
            status: "success",
            details: "Duyệt chiết khấu 8.5% cho khách hàng VIP Công ty CP Sao Mai.",
            createdAt: new Date().toISOString(),
        },
        {
            id: "LOG-1088",
            timestamp: new Date(Date.now() - 14400000).toISOString().slice(0, 19).replace('T', ' '),
            userName: "Hoàng Kim Oanh",
            userEmail: "oanh.hoang@company.vn",
            role: "Nhân sự",
            action: "Cập nhật bảng lương tháng 9",
            module: "HR",
            ipAddress: mockIp(14, 225, 210, 45),
            location: "TP. Hồ Chí Minh, VN (Viettel)",
            device: "Chrome 128 / Windows 10",
            status: "warning",
            details: "Điều chỉnh phụ cấp thâm niên cho 12 nhân viên khối kỹ thuật.",
            createdAt: new Date().toISOString(),
        },
        {
            id: "LOG-1087",
            timestamp: new Date(Date.now() - 18000000).toISOString().slice(0, 19).replace('T', ' '),
            userName: "Phạm Đức Trọng",
            userEmail: "trong.pham@company.vn",
            role: "Kỹ sư IT",
            action: "Đồng bộ API tỷ giá ngoại tệ trực tuyến",
            module: "System",
            ipAddress: "127.0.0.1 (Internal Gateway)",
            location: "Máy chủ nội bộ (Localhost)",
            device: "Next.js API Gateway cronjob",
            status: "success",
            details: "Làm mới tỷ giá hối đoái Vietcombank và giá xăng dầu Petrolimex.",
            createdAt: new Date().toISOString(),
        },
    ];

    return successResponse<AuditLogItem[]>(logs, "Lấy danh sách nhật ký an ninh thành công");
}
