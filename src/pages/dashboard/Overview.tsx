import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@heroui/react';
import { Breadcrumb } from '@/components/layout';
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
} from '@/components/dashboard';
import { StatCard, PerformanceMetric, Activity } from '@/types';

export function DashboardOverview() {
    const { t } = useTranslation();
    const [stats, setStats] = useState<StatCard[]>([]);
    const [revenueData, setRevenueData] = useState<{ name: string; value: number }[]>([]);
    const [ordersData, setOrdersData] = useState<{ name: string; online: number; offline: number; unknown: number }[]>([]);
    const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [usersRes, productsRes, cartsRes, recentCartsRes, postsRes, todosRes, commentsRes] = await Promise.all([
                fetch('https://dummyjson.com/users?limit=0'),
                fetch('https://dummyjson.com/products?limit=0'),
                fetch('https://dummyjson.com/carts?limit=0'),
                fetch('https://dummyjson.com/carts?limit=10'),
                fetch('https://dummyjson.com/posts?limit=5&select=title,body,userId,reactions'),
                fetch('https://dummyjson.com/todos?limit=5'),
                fetch('https://dummyjson.com/comments?limit=5'),
            ]);

            const [users, products, carts, recentCarts, posts, todosData, commentsData] = await Promise.all([
                usersRes.json(),
                productsRes.json(),
                cartsRes.json(),
                recentCartsRes.json(),
                postsRes.json(),
                todosRes.json(),
                commentsRes.json(),
            ]);

            const totalRevenue = recentCarts.carts.reduce(
                (sum: number, cart: { total: number }) => sum + cart.total,
                0
            );

            setStats([
                {
                    title: t('dashboard.totalUsers'),
                    value: users.total,
                    change: Math.floor(Math.random() * 20) + 5,
                    changeType: 'up',
                    color: 'blue',
                    icon: 'fa-users',
                },
                {
                    title: t('dashboard.revenue'),
                    value: Math.round(totalRevenue),
                    change: Math.floor(Math.random() * 15) + 3,
                    changeType: 'up',
                    color: 'green',
                    icon: 'fa-dollar-sign',
                    prefix: '$',
                },
                {
                    title: t('dashboard.orders'),
                    value: carts.total,
                    change: Math.floor(Math.random() * 10) + 2,
                    changeType: 'up',
                    color: 'purple',
                    icon: 'fa-shopping-cart',
                },
                {
                    title: t('dashboard.products'),
                    value: products.total,
                    change: Math.floor(Math.random() * 8) + 1,
                    changeType: 'up',
                    color: 'yellow',
                    icon: 'fa-box',
                },
            ]);

            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            setRevenueData(
                months.map(name => ({
                    name,
                    value: Math.floor(Math.random() * 50000) + 20000,
                }))
            );

            setOrdersData(
                months.map(name => ({
                    name,
                    online: Math.floor(Math.random() * 300) + 100,
                    offline: Math.floor(Math.random() * 200) + 50,
                    unknown: Math.floor(Math.random() * 200) + 50,
                }))
            );

            setPerformanceMetrics([
                { name: 'Customer Satisfaction', value: 92, color: 'green' },
                { name: 'Order Completion', value: 87, color: 'blue' },
                { name: 'Revenue Target', value: 75, color: 'purple' },
                { name: 'Product Availability', value: 95, color: 'yellow' },
            ]);

            const colors = ['blue', 'green', 'purple', 'yellow', 'red'];
            const types = ['New Post', 'Update', 'Comment', 'Review', 'Alert'];
            setActivities(
                posts.posts.map((post: { title: string; body: string }, index: number) => ({
                    title: post.title,
                    description: post.body.substring(0, 100) + '...',
                    time: new Date().toLocaleDateString(),
                    type: types[index % types.length],
                    color: colors[index % colors.length],
                }))
            );

            setTodos(todosData.todos);
            setComments(commentsData.comments);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.dashboard'), href: '#' }, { label: t('menu.overview') }]} />

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('dashboard.title')}
                </h1>
                <Button
                    onPress={loadDashboardData}
                    isDisabled={loading}
                    className="font-medium"
                    color="primary"
                    radius="full"
                    startContent={<ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                >
                    {t('common.refresh')}
                </Button>
            </div>

            <DashboardQuote />

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatsCard key={index} stat={stat} />
                ))}
            </div>

            <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <QuickActions />
                <TodoListWidget todos={todos} />
                <PerformanceMetrics metrics={performanceMetrics} />
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RevenueChart data={revenueData} />
                <OrdersChart data={ordersData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
