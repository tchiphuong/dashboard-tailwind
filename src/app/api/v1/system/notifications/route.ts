import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-response-helper";
import type { NotificationItem } from "@/types";

let notifications: NotificationItem[] = [
    {
        id: 'notif-1',
        title: 'Đơn hàng mới #ORD-9921',
        description: 'Khách hàng Công ty Cổ phần Sao Mai vừa đặt một đơn hàng trị giá 45.000.000 đ.',
        category: 'sales',
        time: '5 phút trước',
        isRead: false,
        priority: 'high',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'notif-2',
        title: 'Cảnh báo đăng nhập từ IP mới',
        description: 'Phát hiện đăng nhập tài khoản Quản trị viên từ địa chỉ IP tại Frankfurt, Đức.',
        category: 'system',
        time: '25 phút trước',
        isRead: false,
        priority: 'high',
        createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
        id: 'notif-3',
        title: 'Hóa đơn HD-2026-0890 đã thanh toán',
        description: 'Tập đoàn Bán lẻ Phương Nam đã thanh toán hóa đơn giá trị 128.500.000 đ qua Vietcombank.',
        category: 'finance',
        time: '2 giờ trước',
        isRead: false,
        priority: 'medium',
        createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
    {
        id: 'notif-4',
        title: 'Sao lưu dữ liệu tự động hoàn tất',
        description: 'Bản sao lưu cơ sở dữ liệu định kỳ lúc 02:00 AM đã được lưu trữ an toàn lên Cloud Storage.',
        category: 'system',
        time: '6 giờ trước',
        isRead: true,
        priority: 'low',
        createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    },
    {
        id: 'notif-5',
        title: 'Yêu cầu duyệt tài sản mới từ IT',
        description: 'Nhân viên Hoàng Kim Oanh gửi yêu cầu cấp phát Tai nghe chống ồn Sony WH-1000XM5.',
        category: 'general',
        time: '1 ngày trước',
        isRead: true,
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const unreadOnly = searchParams.get("unread") === 'true';

    let result = [...notifications];
    if (category && category !== 'all') {
        result = result.filter(n => n.category === category);
    }
    if (unreadOnly) {
        result = result.filter(n => !n.isRead);
    }

    return successResponse(result, "Lấy danh sách thông báo thành công");
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { action, id } = body;

        if (action === 'mark_all_read') {
            notifications = notifications.map(n => ({ ...n, isRead: true }));
            return successResponse(notifications, "Đã đánh dấu tất cả thông báo là đã đọc");
        }

        if (action === 'mark_read' && id) {
            notifications = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
            return successResponse(notifications, "Đã đánh dấu thông báo là đã đọc");
        }

        if (action === 'delete' && id) {
            notifications = notifications.filter(n => n.id !== id);
            return successResponse(notifications, "Đã xóa thông báo");
        }

        return errorResponse("Hành động không hợp lệ", 400);
    } catch {
        return errorResponse("Không thể xử lý yêu cầu", 400);
    }
}
