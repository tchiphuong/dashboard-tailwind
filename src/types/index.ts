// Menu groups
export type MenuGroup =
    | 'main'
    | 'management'
    | 'hr'
    | 'sales'
    | 'inventory'
    | 'purchase'
    | 'crm'
    | 'marketing'
    | 'accounting'
    | 'it'
    | 'documents'
    | 'content'
    | 'workflow'
    | 'reports'
    | 'system';

// Menu types
export interface MenuItem {
    id?: string;
    title: string;
    icon?: string;
    link?: string;
    children?: MenuItem[];
    open?: boolean;
    badge?: number;
    shortcut?: string;
    description?: string;
    group?: MenuGroup;
}

// Stats types
export interface StatCard {
    title: string;
    value: number;
    change: number;
    changeType: 'up' | 'down';
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
    type?: 'info' | 'success' | 'warning';
    title?: string;
    time?: string;
}

// User types
export interface User {
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
export interface Order {
    id: number;
    userId: number;
    total: number;
    discountedTotal?: number;
    totalProducts: number;
    status?: string;
    statusColor?: string;
    customer?: string;
    amount?: string;
}

// Product types
export interface Product {
    id: number;
    title: string;
    price: number;
    rating: number;
    stock: number;
    name?: string;
    sales?: number;
    revenue?: number;
    growth?: number;
}

// Activity types
export interface Activity {
    id?: number;
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

// Quote types
export interface Quote {
    id: number;
    quote: string;
    author: string;
}

// Todo types
export interface Todo {
    id: number;
    todo: string;
    completed: boolean;
    userId: number;
}

// Comment types
export interface Comment {
    id: number;
    body: string;
    postId: number;
    user: {
        id: number;
        username: string;
        fullName: string;
    };
}
