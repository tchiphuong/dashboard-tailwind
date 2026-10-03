import { successResponse } from '@/lib/api-response-helper';
import type { DashboardOverviewData } from '@/types';

export async function GET() {
    let todos: any[] = [];
    let comments: any[] = [];

    try {
        const [todosRes, commentsRes] = await Promise.allSettled([
            fetch('https://dummyjson.com/todos?limit=4', { next: { revalidate: 60 } }),
            fetch('https://dummyjson.com/comments?limit=4', { next: { revalidate: 60 } }),
        ]);

        if (todosRes.status === 'fulfilled' && todosRes.value.ok) {
            const data = await todosRes.value.json();
            todos = data.todos || [];
        }
        if (commentsRes.status === 'fulfilled' && commentsRes.value.ok) {
            const data = await commentsRes.value.json();
            comments = data.comments || [];
        }
    } catch {
        // Fallback
    }

    const overviewData: DashboardOverviewData = {
        stats: [
            {
                title: 'Tổng doanh thu',
                value: 2845900000,
                change: 14.8,
                changeType: 'up',
                color: 'primary',
                icon: 'solar:wallet-money-bold-duotone',
                prefix: '₫',
            },
            {
                title: 'Đơn hàng mới',
                value: 1428,
                change: 8.2,
                changeType: 'up',
                color: 'success',
                icon: 'solar:cart-large-4-bold-duotone',
            },
            {
                title: 'Khách hàng hoạt động',
                value: 38920,
                change: -2.4,
                changeType: 'down',
                color: 'warning',
                icon: 'solar:users-group-rounded-bold-duotone',
            },
            {
                title: 'Tỷ lệ chuyển đổi',
                value: 3.64,
                change: 4.1,
                changeType: 'up',
                color: 'secondary',
                suffix: '%',
                icon: 'solar:chart-2-bold-duotone',
            },
        ],
        revenueChart: {
            months: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
            data: [180, 220, 250, 210, 280, 310, 340, 320, 380, 420, 460, 510],
            target: [200, 230, 260, 240, 290, 320, 350, 340, 400, 430, 480, 520],
        },
        ordersChart: {
            months: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
            online: [450, 520, 610, 580, 690, 750],
            offline: [210, 230, 190, 240, 220, 260],
            unknown: [40, 35, 50, 30, 45, 40],
        },
        performanceMetrics: [
            { name: 'Máy chủ CPU', value: 38, color: '#10b981' },
            { name: 'Bộ nhớ RAM', value: 64, color: '#6366f1' },
            { name: 'Băng thông mạng', value: 42, color: '#06b6d4' },
            { name: 'Dung lượng ổ đĩa', value: 78, color: '#f59e0b' },
        ],
        activities: [
            {
                id: 1,
                title: 'Phê duyệt đơn hàng',
                message: 'Nguyễn Văn An vừa phê duyệt đơn hàng #DH-2024-8921',
                time: '5 phút trước',
                color: 'success',
                type: 'create',
            },
            {
                id: 2,
                title: 'Cập nhật hồ sơ',
                message: 'Trần Thị Mai đã cập nhật hồ sơ nhân sự HR-042',
                time: '25 phút trước',
                color: 'primary',
                type: 'update',
            },
            {
                id: 3,
                title: 'Cảnh báo bảo mật',
                message: 'Hệ thống phát hiện đăng nhập từ IP mới',
                time: '1 giờ trước',
                color: 'danger',
                type: 'security',
            },
        ],
        recentOrders: [
            {
                id: 8921,
                userId: 101,
                total: 45200000,
                totalProducts: 3,
                customer: 'Công ty Cổ phần Alpha',
                amount: '₫45,200,000',
                status: 'Completed',
                statusColor: 'success',
            },
            {
                id: 8920,
                userId: 102,
                total: 128500000,
                totalProducts: 12,
                customer: 'Tập đoàn VinaTech',
                amount: '₫128,500,000',
                status: 'Processing',
                statusColor: 'warning',
            },
            {
                id: 8919,
                userId: 103,
                total: 18400000,
                totalProducts: 2,
                customer: 'Công ty TNHH Bách Khoa',
                amount: '₫18,400,000',
                status: 'Pending',
                statusColor: 'primary',
            },
        ],
        todos:
            todos.length > 0
                ? todos
                : [
                      {
                          id: 1,
                          todo: 'Kiểm tra hệ thống báo cáo quý 3',
                          completed: false,
                          userId: 1,
                      },
                      {
                          id: 2,
                          todo: 'Duyệt yêu cầu cấp phép phân quyền mới',
                          completed: true,
                          userId: 1,
                      },
                  ],
        comments:
            comments.length > 0
                ? comments
                : [
                      {
                          id: 1,
                          body: 'Dữ liệu thời gian thực cập nhật rất chuẩn xác!',
                          postId: 1,
                          user: { id: 1, username: 'admin', fullName: 'Admin' },
                      },
                  ],
    };

    return successResponse(overviewData, 'Lấy dữ liệu tổng quan thành công');
}
