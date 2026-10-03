'use client';

import type { PerformanceMetric } from '@/types';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Card, ProgressBar } from '@/components/common';

interface PerformanceMetricsProps {
    metrics: PerformanceMetric[];
}

const colorMap: Record<string, 'accent' | 'success' | 'warning' | 'danger' | 'default'> = {
    blue: 'accent',
    green: 'success',
    purple: 'accent',
    yellow: 'warning',
    orange: 'warning',
    red: 'danger',
};

export function PerformanceMetrics({ metrics }: Readonly<PerformanceMetricsProps>) {
    const t = useTranslations();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-purple-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-purple-500 dark:bg-zinc-900/90">
            <Card.Header
                icon={<PresentationChartLineIcon className="size-4" />}
                iconColor="secondary"
                title={t('dashboard.performanceMetrics')}
                action={<span className="text-[0.6875rem] text-zinc-400">KPIs mục tiêu</span>}
            />

            <div className="space-y-4">
                {metrics.map((metric, index) => {
                    const heroColor = colorMap[metric.color] || 'accent';
                    return (
                        <div key={index} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                    {metric.name}
                                </span>
                                <span className="font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                                    {metric.value}%
                                </span>
                            </div>
                            <ProgressBar
                                value={metric.value}
                                color={heroColor}
                                size="sm"
                                aria-label={metric.name}
                                className="h-1.5"
                            />
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
