import React from 'react';
import { Card } from '@/components/common/Card';
import { useTranslation } from 'react-i18next';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export const SurveyAnalyticsPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('menu.surveyAnalytics')}
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400">
                        Track performance and insights across all your surveys
                    </p>
                </div>
            </div>

            <Card className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-indigo-50 p-4 dark:bg-indigo-900/20">
                    <ChartBarIcon className="h-12 w-12 text-indigo-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold dark:text-white">Advanced Analytics</h3>
                <p className="max-w-md text-gray-500 dark:text-zinc-400">
                    Get a bird's-eye view of your survey performance with advanced filters,
                    comparative analysis, and automated insights.
                </p>
            </Card>
        </div>
    );
};
