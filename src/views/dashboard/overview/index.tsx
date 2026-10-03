import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/common';
import { Breadcrumb } from '@/components/layout';
import { UserService } from '@/services/user.service';
import { ProductService } from '@/services/product.service';
import { TodoService } from '@/services/todo.service';
import { CommentService } from '@/services/comment.service';
import {
    StatsCard,
    QuickActions,
    RevenueChart,
    OrdersChart,
    PerformanceMetrics,
    ActivityTimeline,
    DashboardQuote,
    RecentComments,
    TodoListWidget,
    VietnamMarketWidget,
} from '@/components/dashboard';
import { StatCard, PerformanceMetric, Activity, Todo, Comment } from '@/types';

export function DashboardOverview() {
    const t = useTranslations();
    const [stats, setStats] = useState<StatCard[]>([]);
    const [revenueData, setRevenueData] = useState<{ name: string; value: number }[]>([]);
    const [ordersData, setOrdersData] = useState<
        { name: string; online: number; offline: number; unknown: number }[]
    >([]);
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        try {
            const [usersRes, productsRes, todosRes, commentsRes] = await Promise.all([
                UserService.list({ pageIndex: 1, pageSize: 1 }).catch(() => null),
                ProductService.list({ pageIndex: 1, pageSize: 1 }).catch(() => null),
                TodoService.list({ pageIndex: 1, pageSize: 5 }).catch(() => null),
                CommentService.list({ pageIndex: 1, pageSize: 5 }).catch(() => null),
            ]);

            const userTotal = usersRes?.data?.paging?.totalItems || 120;
            const productTotal = productsRes?.data?.paging?.totalItems || 194;
            const loadedTodos = todosRes?.data?.items || [];
            const loadedComments = commentsRes?.data?.items || [];

            const totalRevenue = productTotal * 450;

            setStats([
                {
                    title: t('dashboard.totalUsers'),
                    value: userTotal,
                    change: 12,
                    changeType: 'up',
                    color: 'blue',
                    icon: 'fa-users',
                },
                {
                    title: t('dashboard.revenue'),
                    value: Math.round(totalRevenue),
                    change: 8,
                    changeType: 'up',
                    color: 'green',
                    icon: 'fa-dollar-sign',
                    prefix: '$',
                },
                {
                    title: t('dashboard.orders'),
                    value: 348,
                    change: 5,
                    changeType: 'up',
                    color: 'purple',
                    icon: 'fa-shopping-cart',
                },
                {
                    title: t('dashboard.products'),
                    value: productTotal,
                    change: 3,
                    changeType: 'up',
                    color: 'yellow',
                    icon: 'fa-box',
                },
            ]);

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            setRevenueData(
                months.map((name, i) => ({
                    name,
                    value: (i + 1) * 12500 + 20000,
                }))
            );

            setOrdersData(
                months.map((name, i) => ({
                    name,
                    online: (i + 1) * 45 + 120,
                    offline: (i + 1) * 30 + 80,
                    unknown: (i + 1) * 15 + 40,
                }))
            );

            setPerformanceMetrics([
                { name: 'Customer Satisfaction', value: 92, color: 'green' },
                { name: 'Order Completion', value: 87, color: 'blue' },
                { name: 'Revenue Target', value: 75, color: 'purple' },
                { name: 'Product Availability', value: 95, color: 'yellow' },
            ]);

            setActivities([
                {
                    id: 1,
                    title: 'Cập nhật hệ thống ERP',
                    description: 'Hoàn tất kết nối Service Layer & Gateway API',
                    time: 'Hôm nay',
                    type: 'Update',
                    color: 'blue',
                },
                {
                    id: 2,
                    title: 'Đơn hàng mới #1092',
                    description: 'Khách hàng thanh toán qua VietQR',
                    time: '10 phút trước',
                    type: 'Order',
                    color: 'green',
                },
                {
                    id: 3,
                    title: 'Bình luận khách hàng mới',
                    description: 'Đánh giá 5 sao cho dịch vụ',
                    time: '1 giờ trước',
                    type: 'Comment',
                    color: 'purple',
                },
            ]);

            setTodos(loadedTodos);
            setComments(loadedComments);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        void loadDashboardData();
    }, [loadDashboardData]);

    return (
        <>
            <Breadcrumb
                items={[{ label: t('menu.dashboard'), href: '#' }, { label: t('menu.overview') }]}
            />

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('dashboard.title')}
                </h1>
                <Button
                    onPress={loadDashboardData}
                    isDisabled={loading}
                    className="font-medium"
                    color="primary"
                    startContent={
                        <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    }
                >
                    {t('common.refresh')}
                </Button>
            </div>

            <DashboardQuote />

            <div className="mb-6">
                <VietnamMarketWidget />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <StatsCard key={stat.title} stat={stat} />
                ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <QuickActions />
                <TodoListWidget todos={todos} />
                <PerformanceMetrics metrics={performanceMetrics} />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RevenueChart data={revenueData} />
                <OrdersChart data={ordersData} />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ActivityTimeline activities={activities} />
                </div>
                <div>
                    <RecentComments comments={comments} />
                </div>
            </div>
        </>
    );
}
