import { useTranslation } from 'react-i18next';
import { Activity } from '@/types';
import { ClockIcon } from '@heroicons/react/24/outline';

interface ActivityTimelineProps {
    activities: Activity[];
}

const colorClasses: Record<string, { dot: string; badge: string }> = {
    blue: { dot: 'bg-blue-500 dark:bg-blue-400', badge: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300' },
    green: { dot: 'bg-green-500 dark:bg-green-400', badge: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' },
    purple: { dot: 'bg-purple-500 dark:bg-purple-400', badge: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300' },
    yellow: { dot: 'bg-yellow-500 dark:bg-yellow-400', badge: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300' },
    red: { dot: 'bg-red-500 dark:bg-red-400', badge: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300' },
    orange: { dot: 'bg-orange-500 dark:bg-orange-400', badge: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300' },
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                {t('dashboard.recentActivities')}
            </h3>
            <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-5">
                    {activities.map((activity, index) => {
                        const colors = colorClasses[activity.color] || colorClasses.blue;
                        return (
                            <div key={index} className="relative flex items-start ml-2">
                                {/* Timeline dot */}
                                <div className={`absolute left-0 w-2.5 h-2.5 rounded-full ${colors.dot} border-2 border-white dark:border-gray-800`} />

                                <div className="ml-6 flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {activity.title}
                                        </h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {activity.time}
                                        </span>
                                    </div>
                                    {activity.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                            {activity.description}
                                        </p>
                                    )}
                                    {activity.type && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                                            {activity.type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
