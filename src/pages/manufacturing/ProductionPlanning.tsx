import { useTranslation } from 'react-i18next';
import { PlusIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { PageHeader, Card, Button } from '@/components/common';

export function ProductionPlanningPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('manufacturing.planning.title')}
                breadcrumbs={[
                    { label: t('nav.manufacturing'), href: '/manufacturing' },
                    { label: t('manufacturing.planning.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('manufacturing.planning.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex flex-col items-center justify-center py-12">
                        <CalendarDaysIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            {t('manufacturing.planning.title')}
                        </h3>
                        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                            {t('manufacturing.planning.description')}
                        </p>
                        <Button color="primary" className="mt-4">
                            {t('manufacturing.planning.create')}
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}
