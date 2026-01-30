import { useTranslation } from 'react-i18next';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface OrdersChartProps {
    data: { name: string; online: number; offline: number; unknown: number }[];
}

export function OrdersChart({ data }: OrdersChartProps) {
    const { t } = useTranslation();
    const { darkMode } = useTheme();

    return (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-800 dark:text-gray-200">
                <ChartBarIcon className="mr-2 h-5 w-5 text-green-500" />
                {t('dashboard.ordersTrend')}
            </h3>
            <div className="relative h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={darkMode ? '#374151' : '#E5E7EB'}
                            opacity={0.5}
                        />
                        <XAxis
                            dataKey="name"
                            stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                            fontSize={12}
                        />
                        <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? '#1F2937' : 'rgba(255,255,255,0.95)',
                                borderRadius: '8px',
                                border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                color: darkMode ? '#F3F4F6' : '#111827',
                            }}
                            itemStyle={{ color: darkMode ? '#F3F4F6' : '#111827' }}
                            cursor={{ fill: darkMode ? '#374151' : '#F3F4F6', opacity: 0.4 }}
                        />
                        <Legend />
                        <Bar dataKey="online" name="Online" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar
                            dataKey="offline"
                            name="Offline"
                            fill="#10B981"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="unknown"
                            name="Unknown"
                            fill="#8B5CF6"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
