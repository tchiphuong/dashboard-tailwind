import type { Activity, Comment, Order, StatCard, Todo } from "./index";

export interface DashboardOverviewData {
    stats: StatCard[];
    revenueChart: {
        months: string[];
        data: number[];
        target: number[];
    };
    ordersChart: {
        months: string[];
        online: number[];
        offline: number[];
        unknown: number[];
    };
    performanceMetrics: {
        name: string;
        value: number;
        color: string;
    }[];
    activities: Activity[];
    recentOrders: Order[];
    todos: Todo[];
    comments: Comment[];
}
