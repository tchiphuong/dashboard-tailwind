import { useTranslation } from 'react-i18next';
import { PerformanceMetric } from '@/types';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';

interface PerformanceMetricsProps {
    metrics: PerformanceMetric[];
}

const colorClasses: Record<string, { text: string; bg: string }> = {
    blue: { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500' },
    green: { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-500' },
    purple: { text: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500' },
    yellow: { text: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500' },
    orange: { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500' },
    red: { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-500' },
};

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <PresentationChartLineIcon className="w-5 h-5 mr-2 text-purple-500" />
                {t('dashboard.performanceMetrics')}
            </h3>
            <div className="space-y-5">
                {metrics.map((metric, index) => {
                    const colors = colorClasses[metric.color] || colorClasses.blue;
                    return (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {metric.name}
                                </span>
                                <span className={`text-sm font-semibold ${colors.text}`}>
                                    {metric.value}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all duration-500 ${colors.bg}`}
                                    style={{ width: `${metric.value}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
