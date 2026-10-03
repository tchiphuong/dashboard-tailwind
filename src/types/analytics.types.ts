import type { BaseEntity } from "./api";

// Thống kê xu hướng lưu lượng
export interface TrafficTrendItem {
    name: string;
    pageviews: number;
    sessions: number;
    users: number;
}

// Kênh thu hút nguồn truy cập
export interface AcquisitionSource {
    name: string;
    visitors: number;
    percentage: number;
    color: 'default' | 'accent' | 'success' | 'warning' | 'danger';
    colorHex: string;
    icon: string;
}

// Các bước trong phễu chuyển đổi
export interface FunnelStep {
    step: string;
    name: string;
    count: number;
    conversion: number;
    dropoff: number;
    color: 'default' | 'accent' | 'success' | 'warning' | 'danger';
}

// Bảng thống kê trang truy cập phổ biến
export interface TopPageItem extends BaseEntity {
    path: string;
    title: string;
    views: number;
    uniqueUsers: number;
    avgTime: string;
    bounceRate: number;
    trend: 'up' | 'down';
    statusType: 'optimal' | 'good' | 'needs_work';
}

// Phân bổ địa lý
export interface LocationItem {
    city: string;
    country: string;
    sessions: number;
    percentage: number;
    revenueAvg: string;
}

// Thẻ chỉ số tổng quan
export interface AnalyticsKPI {
    pageviews: number;
    pageviewsChange: number;
    uniqueUsers: number;
    uniqueUsersChange: number;
    avgSessionDuration: string;
    avgSessionDurationChange: number;
    bounceRate: number;
    bounceRateChange: number;
    activeOnlineNow: number;
}

// Toàn bộ dữ liệu tổng hợp cho trang Analytics
export interface AnalyticsDashboardData {
    kpis: AnalyticsKPI;
    trafficTrend: TrafficTrendItem[];
    acquisitionSources: AcquisitionSource[];
    funnelSteps: FunnelStep[];
    topPages: TopPageItem[];
    locations: LocationItem[];
}
