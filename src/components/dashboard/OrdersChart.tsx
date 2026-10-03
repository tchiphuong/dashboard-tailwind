'use client';

import { useTheme } from '@/contexts';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Card } from '@/components/common';

interface OrdersChartProps {
    data: { name: string; online: number; offline: number; unknown: number }[];
}

export function OrdersChart({ data }: Readonly<OrdersChartProps>) {
    const t = useTranslations();
    const { darkMode } = useTheme();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-emerald-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-emerald-500 dark:bg-zinc-900/90">
            <Card.Header
                icon={<ChartBarIcon className="size-4" />}
                iconColor="success"
                title={t('dashboard.ordersTrend')}
                action={<span className="text-[0.6875rem] text-zinc-400">Theo kênh bán hàng</span>}
            />

            <div className="relative h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={darkMode ? '#27272a' : '#f4f4f5'}
                            opacity={0.8}
                        />
                        <XAxis
                            dataKey="name"
                            stroke={darkMode ? '#71717a' : '#a1a1aa'}
                            fontSize={11}
                            tickLine={false}
                        />
                        <YAxis
                            stroke={darkMode ? '#71717a' : '#a1a1aa'}
                            fontSize={11}
                            tickLine={false}
                            className="tabular-nums"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? '#18181b' : 'rgba(255,255,255,0.95)',
                                borderRadius: '12px',
                                border: darkMode ? '1px solid #27272a' : '1px solid #e4e4e7',
                                color: darkMode ? '#fafafa' : '#18181b',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                            itemStyle={{ color: darkMode ? '#fafafa' : '#18181b' }}
                            cursor={{ fill: darkMode ? '#27272a' : '#f4f4f5', opacity: 0.5 }}
                        />
                        <Legend />
                        <Bar
                            dataKey="online"
                            name="Trực tuyến"
                            fill="#3B82F6"
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            dataKey="offline"
                            name="Tại quầy"
                            fill="#10B981"
                            radius={[6, 6, 0, 0]}
                        />
                        <Bar
                            dataKey="unknown"
                            name="Kênh khác"
                            fill="#8B5CF6"
                            radius={[6, 6, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
