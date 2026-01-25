import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { ChartPieIcon } from '@heroicons/react/24/outline';

interface RevenueChartProps {
    data: { name: string; value: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

export function RevenueChart({ data }: RevenueChartProps) {
    const { t } = useTranslation();
    const { darkMode } = useTheme();

    return (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                <ChartPieIcon className="w-5 h-5 mr-2 text-blue-500" />
                {t('dashboard.revenueTrend')}
            </h3>
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
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                            contentStyle={{
                                backgroundColor: darkMode ? '#1F2937' : 'rgba(255,255,255,0.95)',
                                borderRadius: '8px',
                                border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                                color: darkMode ? '#F3F4F6' : '#111827',
                            }}
                            itemStyle={{ color: darkMode ? '#F3F4F6' : '#111827' }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
