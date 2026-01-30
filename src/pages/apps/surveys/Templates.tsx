import React from 'react';
import { Card } from '@/components/common/Card';
import { useTranslation } from 'react-i18next';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

export const SurveyTemplatesPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('menu.surveyTemplates')}
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400">
                        Select a pre-built template to get started quickly
                    </p>
                </div>
            </div>

            <Card className="flex flex-col items-center justify-center py-20 text-center">
                <div className="mb-4 rounded-full bg-blue-50 p-4 dark:bg-blue-900/20">
                    <DocumentDuplicateIcon className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="mb-2 text-xl font-semibold dark:text-white">Survey Templates</h3>
                <p className="max-w-md text-gray-500 dark:text-zinc-400">
                    We're working on a collection of industry-standard survey templates to help you
                    gather better insights. This feature will be available soon!
                </p>
            </Card>
        </div>
    );
};
