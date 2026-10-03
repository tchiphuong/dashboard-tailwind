import type { BaseEntity } from "./api";

export * from "./api";
export * from "./auth";
export * from "./user.types";
export * from "./product.types";
export * from "./role.types";
export * from "./department.types";
export * from "./position.types";
export * from "./todo.types";
export * from "./quote.types";
export * from "./comment.types";
export * from "./utility.types";
export * from "./dashboard.types";
export * from "./post.types";
export * from "./audit-log.types";
export * from "./asset.types";
export * from "./project.types";
export * from "./notification.types";
export * from "./finance.types";
export * from "./analytics.types";

// Menu groups
export type MenuGroup =
    | "main"
    | "management"
    | "hr"
    | "sales"
    | "inventory"
    | "purchase"
    | "crm"
    | "marketing"
    | "accounting"
    | "it"
    | "documents"
    | "content"
    | "communication"
    | "workflow"
    | "reports"
    | "apps"
    | "system";

// Menu types
export interface NavbarItem {
    id?: string;
    title: string;
    icon?: string;
    link?: string;
    children?: NavbarItem[];
    open?: boolean;
    badge?: number;
    shortcut?: string;
    description?: string;
    group?: MenuGroup;
}

export type MenuItem = NavbarItem;

// Stats types
export interface StatCard {
    title: string;
    value: number;
    change: number;
    changeType: "up" | "down";
    color: string;
    icon: string;
    prefix?: string;
    suffix?: string;
}

// Notification types
export interface Notification {
    id: number;
    name: string;
    email: string;
    body: string;
    type?: "info" | "success" | "warning";
    title?: string;
    time?: string;
}

// Random User types (cho mock)
export interface RandomUser {
    name: {
        first: string;
        last: string;
    };
    email: string;
    picture: {
        medium: string;
        thumbnail: string;
    };
    location?: {
        country: string;
    };
    dob?: {
        age: number;
    };
}

// Order types
export interface Order extends BaseEntity {
    id: number;
    userId: number;
    total: number;
    discountedTotal?: number;
    totalProducts: number;
    statusColor?: string;
    customer?: string;
    amount?: string;
}

// Activity types
export interface Activity extends BaseEntity {
    title: string;
    description?: string;
    message?: string;
    time: string;
    type?: string;
    icon?: string;
    color: string;
}

// Performance metric types
export interface PerformanceMetric {
    name: string;
    value: number;
    color: string;
}

// Category types
export interface Category {
    name: string;
    percentage: number;
    color: string;
}

// Chart data types
export interface ChartData {
    revenueChart: {
        labels: string[];
        data: number[];
        target: number[];
    };
    ordersChart: {
        labels: string[];
        online: number[];
        offline: number[];
        unknown: number[];
    };
}
