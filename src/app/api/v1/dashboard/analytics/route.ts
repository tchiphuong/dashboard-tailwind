import { NextRequest } from "next/server";
import { successResponse } from "@/lib/api-response-helper";
import type {
    AnalyticsDashboardData,
    TrafficTrendItem,
    AnalyticsKPI,
} from "@/types/analytics.types";

/**
 * RESTful API Gateway - Phân hệ Analytics
 * Trả về dữ liệu phân tích tương ứng theo khoảng thời gian (period: 24h | 7d | 30d | 90d | 1y)
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "7d";

    let kpis: AnalyticsKPI;
    let trafficTrend: TrafficTrendItem[];

    switch (period) {
        case "24h":
            kpis = {
                pageviews: 48920,
                pageviewsChange: 18.2,
                uniqueUsers: 14200,
                uniqueUsersChange: 12.4,
                avgSessionDuration: "03m 50s",
                avgSessionDurationChange: 8.1,
                bounceRate: 35.6,
                bounceRateChange: -4.5,
                activeOnlineNow: 164,
            };
            trafficTrend = [
                { name: "00:00", pageviews: 2400, sessions: 1600, users: 1100 },
                { name: "04:00", pageviews: 1200, sessions: 850, users: 620 },
                { name: "08:00", pageviews: 6800, sessions: 4900, users: 3200 },
                { name: "12:00", pageviews: 9400, sessions: 6700, users: 4400 },
                { name: "16:00", pageviews: 11200, sessions: 8100, users: 5300 },
                { name: "20:00", pageviews: 12400, sessions: 8900, users: 5900 },
                { name: "24:00", pageviews: 5520, sessions: 3950, users: 2600 },
            ];
            break;

        case "30d":
            kpis = {
                pageviews: 1642800,
                pageviewsChange: 16.5,
                uniqueUsers: 382400,
                uniqueUsersChange: 11.2,
                avgSessionDuration: "04m 45s",
                avgSessionDurationChange: 14.0,
                bounceRate: 37.1,
                bounceRateChange: -2.8,
                activeOnlineNow: 152,
            };
            trafficTrend = [
                { name: "Tuần 1", pageviews: 384000, sessions: 256000, users: 168000 },
                { name: "Tuần 2", pageviews: 412000, sessions: 278000, users: 182000 },
                { name: "Tuần 3", pageviews: 436000, sessions: 294000, users: 195000 },
                { name: "Tuần 4", pageviews: 410800, sessions: 275000, users: 181000 },
            ];
            break;

        case "90d":
            kpis = {
                pageviews: 4920000,
                pageviewsChange: 21.4,
                uniqueUsers: 1140000,
                uniqueUsersChange: 15.6,
                avgSessionDuration: "04m 58s",
                avgSessionDurationChange: 16.2,
                bounceRate: 36.4,
                bounceRateChange: -5.1,
                activeOnlineNow: 145,
            };
            trafficTrend = [
                { name: "Tháng trước nữa", pageviews: 1520000, sessions: 1020000, users: 680000 },
                { name: "Tháng trước", pageviews: 1650000, sessions: 1110000, users: 740000 },
                { name: "Tháng này", pageviews: 1750000, sessions: 1180000, users: 790000 },
            ];
            break;

        case "1y":
            kpis = {
                pageviews: 19850000,
                pageviewsChange: 28.6,
                uniqueUsers: 4520000,
                uniqueUsersChange: 22.8,
                avgSessionDuration: "05m 12s",
                avgSessionDurationChange: 19.4,
                bounceRate: 34.8,
                bounceRateChange: -6.2,
                activeOnlineNow: 138,
            };
            trafficTrend = [
                { name: "Quý 1", pageviews: 4200000, sessions: 2800000, users: 1850000 },
                { name: "Quý 2", pageviews: 4850000, sessions: 3250000, users: 2160000 },
                { name: "Quý 3", pageviews: 5200000, sessions: 3480000, users: 2310000 },
                { name: "Quý 4", pageviews: 5600000, sessions: 3750000, users: 2490000 },
            ];
            break;

        case "7d":
        default:
            kpis = {
                pageviews: 384920,
                pageviewsChange: 14.8,
                uniqueUsers: 92410,
                uniqueUsersChange: 8.5,
                avgSessionDuration: "04m 32s",
                avgSessionDurationChange: 12.3,
                bounceRate: 38.4,
                bounceRateChange: -3.2,
                activeOnlineNow: 148,
            };
            trafficTrend = [
                { name: "Thứ 2", pageviews: 42100, sessions: 28400, users: 18200 },
                { name: "Thứ 3", pageviews: 48900, sessions: 32600, users: 21500 },
                { name: "Thứ 4", pageviews: 56300, sessions: 38200, users: 24900 },
                { name: "Thứ 5", pageviews: 61400, sessions: 41800, users: 27100 },
                { name: "Thứ 6", pageviews: 68900, sessions: 46200, users: 30400 },
                { name: "Thứ 7", pageviews: 54200, sessions: 35100, users: 22800 },
                { name: "CN", pageviews: 53120, sessions: 34200, users: 21900 },
            ];
            break;
    }

    const data: AnalyticsDashboardData = {
        kpis,
        trafficTrend,
        acquisitionSources: [
            {
                name: "Tìm kiếm tự nhiên (Organic Search)",
                visitors: Math.round(kpis.pageviews * 0.42),
                percentage: 42.0,
                color: "accent",
                colorHex: "#3b82f6",
                icon: "solar:magnifer-linear",
            },
            {
                name: "Truy cập trực tiếp (Direct URL)",
                visitors: Math.round(kpis.pageviews * 0.28),
                percentage: 28.0,
                color: "success",
                colorHex: "#10b981",
                icon: "solar:link-circle-linear",
            },
            {
                name: "Mạng xã hội (Social Media)",
                visitors: Math.round(kpis.pageviews * 0.15),
                percentage: 15.0,
                color: "warning",
                colorHex: "#f59e0b",
                icon: "solar:share-circle-linear",
            },
            {
                name: "Giới thiệu từ website khác (Referral)",
                visitors: Math.round(kpis.pageviews * 0.1),
                percentage: 10.0,
                color: "default",
                colorHex: "#8b5cf6",
                icon: "solar:users-group-rounded-linear",
            },
            {
                name: "Quảng cáo trả phí (Paid Campaigns)",
                visitors: Math.round(kpis.pageviews * 0.05),
                percentage: 5.0,
                color: "danger",
                colorHex: "#ec4899",
                icon: "solar:target-linear",
            },
        ],
        funnelSteps: [
            {
                step: "Bước 1",
                name: "Khách ghé thăm trang chủ / Landing",
                count: kpis.uniqueUsers,
                conversion: 100,
                dropoff: 0,
                color: "accent",
            },
            {
                step: "Bước 2",
                name: "Xem chi tiết sản phẩm / Báo giá",
                count: Math.round(kpis.uniqueUsers * 0.56),
                conversion: 56.0,
                dropoff: 44.0,
                color: "accent",
            },
            {
                step: "Bước 3",
                name: "Tương tác dùng thử / Đăng ký form",
                count: Math.round(kpis.uniqueUsers * 0.25),
                conversion: 25.0,
                dropoff: 55.4,
                color: "warning",
            },
            {
                step: "Bước 4",
                name: "Xác thực tài khoản / Điền hồ sơ",
                count: Math.round(kpis.uniqueUsers * 0.128),
                conversion: 12.8,
                dropoff: 48.9,
                color: "warning",
            },
            {
                step: "Bước 5",
                name: "Chuyển đổi thành công (Đơn hàng / Giao dịch)",
                count: Math.round(kpis.uniqueUsers * 0.0384),
                conversion: 3.84,
                dropoff: 69.9,
                color: "success",
            },
        ],
        topPages: [
            {
                id: "page-1",
                path: "/dashboard",
                title: "Bảng điều khiển trung tâm",
                views: Math.round(kpis.pageviews * 0.324),
                uniqueUsers: Math.round(kpis.uniqueUsers * 0.69),
                avgTime: "03:42",
                bounceRate: 28.4,
                trend: "up",
                statusType: "optimal",
                createdAt: "2026-01-01",
                updatedAt: "2026-10-01",
                status: "active",
            },
            {
                id: "page-2",
                path: "/sales/products",
                title: "Danh mục sản phẩm & Dịch vụ",
                views: Math.round(kpis.pageviews * 0.232),
                uniqueUsers: Math.round(kpis.uniqueUsers * 0.52),
                avgTime: "04:15",
                bounceRate: 34.1,
                trend: "up",
                statusType: "optimal",
                createdAt: "2026-01-01",
                updatedAt: "2026-10-01",
                status: "active",
            },
            {
                id: "page-3",
                path: "/accounting/vietqr",
                title: "Cổng thanh toán VietQR Pro",
                views: Math.round(kpis.pageviews * 0.169),
                uniqueUsers: Math.round(kpis.uniqueUsers * 0.42),
                avgTime: "02:50",
                bounceRate: 22.8,
                trend: "up",
                statusType: "optimal",
                createdAt: "2026-01-01",
                updatedAt: "2026-10-01",
                status: "active",
            },
            {
                id: "page-4",
                path: "/crm/customers",
                title: "Hồ sơ khách hàng doanh nghiệp",
                views: Math.round(kpis.pageviews * 0.117),
                uniqueUsers: Math.round(kpis.uniqueUsers * 0.27),
                avgTime: "05:12",
                bounceRate: 41.6,
                trend: "down",
                statusType: "good",
                createdAt: "2026-01-01",
                updatedAt: "2026-10-01",
                status: "active",
            },
            {
                id: "page-5",
                path: "/reports/finance",
                title: "Báo cáo doanh thu & Dòng tiền",
                views: Math.round(kpis.pageviews * 0.099),
                uniqueUsers: Math.round(kpis.uniqueUsers * 0.21),
                avgTime: "06:04",
                bounceRate: 46.2,
                trend: "up",
                statusType: "needs_work",
                createdAt: "2026-01-01",
                updatedAt: "2026-10-01",
                status: "active",
            },
        ],
        locations: [
            {
                city: "TP. Hồ Chí Minh",
                country: "Việt Nam",
                sessions: Math.round(kpis.pageviews * 0.28),
                percentage: 42.5,
                revenueAvg: "1.450.000 đ",
            },
            {
                city: "Hà Nội",
                country: "Việt Nam",
                sessions: Math.round(kpis.pageviews * 0.21),
                percentage: 31.8,
                revenueAvg: "1.620.000 đ",
            },
            {
                city: "Đà Nẵng",
                country: "Việt Nam",
                sessions: Math.round(kpis.pageviews * 0.07),
                percentage: 11.2,
                revenueAvg: "1.180.000 đ",
            },
            {
                city: "Cần Thơ & Miền Tây",
                country: "Việt Nam",
                sessions: Math.round(kpis.pageviews * 0.04),
                percentage: 5.6,
                revenueAvg: "980.000 đ",
            },
            {
                city: "Hải Phòng",
                country: "Việt Nam",
                sessions: Math.round(kpis.pageviews * 0.03),
                percentage: 4.4,
                revenueAvg: "1.250.000 đ",
            },
            {
                city: "Quốc tế (US, JP, SG...)",
                country: "Nước ngoài",
                sessions: Math.round(kpis.pageviews * 0.03),
                percentage: 4.5,
                revenueAvg: "2.840.000 đ",
            },
        ],
    };

    return successResponse(data, "Lấy dữ liệu phân tích thành công");
}
