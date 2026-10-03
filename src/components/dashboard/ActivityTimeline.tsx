'use client';

import type { Activity } from '@/types';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Card, Chip } from '@/components/common';

interface ActivityTimelineProps {
    activities: Activity[];
}

const colorMap: Record<
    string,
    { dot: string; chipColor: 'accent' | 'success' | 'warning' | 'danger' | 'default' }
> = {
    blue: {
        dot: 'bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-950/50',
        chipColor: 'accent',
    },
    green: {
        dot: 'bg-emerald-500 ring-4 ring-emerald-50 dark:ring-emerald-950/50',
        chipColor: 'success',
    },
    purple: {
        dot: 'bg-purple-500 ring-4 ring-purple-50 dark:ring-purple-950/50',
        chipColor: 'accent',
    },
    yellow: {
        dot: 'bg-amber-500 ring-4 ring-amber-50 dark:ring-amber-950/50',
        chipColor: 'warning',
    },
    red: {
        dot: 'bg-rose-500 ring-4 ring-rose-50 dark:ring-rose-950/50',
        chipColor: 'danger',
    },
    orange: {
        dot: 'bg-orange-500 ring-4 ring-orange-50 dark:ring-orange-950/50',
        chipColor: 'warning',
    },
};

export function ActivityTimeline({ activities }: Readonly<ActivityTimelineProps>) {
    const t = useTranslations();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-blue-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-blue-500 dark:bg-zinc-900/90">
            <Card.Header
                icon={<ClockIcon className="size-4" />}
                iconColor="primary"
                title={t('dashboard.recentActivities')}
                action={<span className="text-[0.6875rem] text-zinc-400">Nhật ký hệ thống</span>}
            />

            <div className="relative">
                {/* Timeline line */}
                <div className="absolute top-2 bottom-2 left-2 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

                <div className="space-y-4">
                    {activities.map((activity, index) => {
                        const meta = colorMap[activity.color] || colorMap.blue;
                        return (
                            <div key={index} className="relative ml-0.5 flex items-start">
                                {/* Timeline dot */}
                                <div
                                    className={`relative z-10 mt-1 size-3 rounded-full ${meta.dot}`}
                                />

                                <div className="ml-5 flex-1 rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60">
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                        <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                            {activity.title}
                                        </h4>
                                        <span className="shrink-0 text-[10px] text-zinc-400 tabular-nums">
                                            {activity.time}
                                        </span>
                                    </div>
                                    {activity.description && (
                                        <p className="mb-2 line-clamp-2 text-xs text-zinc-600 dark:text-zinc-400">
                                            {activity.description}
                                        </p>
                                    )}
                                    {activity.type && (
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color={meta.chipColor}
                                            className="h-5 text-[10px] font-semibold"
                                        >
                                            {activity.type}
                                        </Chip>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}
