import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectItem } from '@heroui/react';
import { Select } from '@/components/common/Select';
import { Breadcrumb } from '@/components/layout';
import { RevenueChart, OrdersChart, StatsCard } from '@/components/dashboard';
import { StatCard } from '@/types';

export function DashboardAnalytics() {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('7d');

    // Mock data for analytics
    const stats: StatCard[] = [
        {
            title: 'Total Visits',
            value: 12450,
            change: 12,
            changeType: 'up',
            color: 'blue',
            icon: 'fa-eye',
        },
        {
            title: 'Bounce Rate',
            value: 42.5,
            change: -2.3,
            changeType: 'up', // 'up' because lower bounce rate is good, but visual might need adjustment
            color: 'green',
            icon: 'fa-arrow-right',
            suffix: '%',
        },
        {
            title: 'Session Duration',
            value: 135, // Changed to seconds (number) to match type, will use suffix or formatter if needed, or update type
            change: 5.1,
            changeType: 'up',
            color: 'purple',
            icon: 'fa-clock',
            suffix: 's',
        },
        {
            title: 'Conversion Rate',
            value: 3.2,
            change: 0.8,
            changeType: 'up',
            color: 'yellow',
            icon: 'fa-check-circle',
            suffix: '%',
        },
    ];

    const revenueData = [
        { name: 'Mon', value: 4000 },
        { name: 'Tue', value: 3000 },
        { name: 'Wed', value: 2000 },
        { name: 'Thu', value: 2780 },
        { name: 'Fri', value: 1890 },
        { name: 'Sat', value: 2390 },
        { name: 'Sun', value: 3490 },
    ];

    const trafficData = [
        { name: 'Direct', online: 400, offline: 0, unknown: 0 },
        { name: 'Social', online: 300, offline: 0, unknown: 0 },
        { name: 'Organic', online: 300, offline: 0, unknown: 0 },
        { name: 'Referral', online: 200, offline: 0, unknown: 0 },
    ];

    return (
        <>
            <Breadcrumb
                items={[{ label: t('menu.dashboard'), href: '#' }, { label: 'Analytics' }]}
            />

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Analytics Overview
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Monitor your key performance metrics
                    </p>
                </div>
                <div className="w-full sm:w-48">
                    <Select
                        label="Period"
                        size="sm"
                        selectedKeys={[period]}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <SelectItem key="7d">Last 7 days</SelectItem>
                        <SelectItem key="30d">Last 30 days</SelectItem>
                        <SelectItem key="90d">Last 3 months</SelectItem>
                    </Select>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <StatsCard key={index} stat={stat} />
                ))}
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RevenueChart data={revenueData} />
                <OrdersChart data={trafficData} />
            </div>
        </>
    );
}
