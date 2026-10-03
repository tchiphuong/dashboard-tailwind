'use client';

import { useTheme } from '@/contexts';
import { ChartPieIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/common';

interface RevenueChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export function RevenueChart({ data }: Readonly<RevenueChartProps>) {
    const t = useTranslations();
    const { darkMode } = useTheme();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-blue-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-blue-500 dark:bg-zinc-900/90">
            <Card.Header
                icon={<ChartPieIcon className="size-4" />}
                iconColor="primary"
                title={t('dashboard.revenueTrend')}
                action={<span className="text-[0.6875rem] text-zinc-400">Phân bổ nguồn thu</span>}
            />

            <div className="relative h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={90}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number) => [
                                `$${value.toLocaleString()}`,
                                'Doanh thu',
                            ]}
                            contentStyle={{
                                backgroundColor: darkMode ? '#18181b' : 'rgba(255,255,255,0.95)',
                                borderRadius: '12px',
                                border: darkMode ? '1px solid #27272a' : '1px solid #e4e4e7',
                                color: darkMode ? '#fafafa' : '#18181b',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            itemStyle={{ color: darkMode ? '#fafafa' : '#18181b' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
