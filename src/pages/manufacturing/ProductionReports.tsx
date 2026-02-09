import { useTranslation } from 'react-i18next';
import { ChartBarIcon, DocumentCheckIcon, CubeIcon } from '@heroicons/react/24/outline';
import { PageHeader, Card } from '@/components/common';

export function ProductionReportsPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('manufacturing.reports.title')}
                breadcrumbs={[
                    { label: t('nav.manufacturing'), href: '/manufacturing' },
                    { label: t('manufacturing.reports.title') },
                ]}
            />

            <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="cursor-pointer p-6 transition-shadow hover:shadow-lg">
                        <ChartBarIcon className="h-10 w-10 text-blue-600" />
                        <h3 className="mt-4 font-semibold">{t('manufacturing.reports.output')}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {t('manufacturing.reports.outputDesc')}
                        </p>
                    </Card>
                    <Card className="cursor-pointer p-6 transition-shadow hover:shadow-lg">
                        <DocumentCheckIcon className="h-10 w-10 text-green-600" />
                        <h3 className="mt-4 font-semibold">
                            {t('manufacturing.reports.efficiency')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {t('manufacturing.reports.efficiencyDesc')}
                        </p>
                    </Card>
                    <Card className="cursor-pointer p-6 transition-shadow hover:shadow-lg">
                        <CubeIcon className="h-10 w-10 text-purple-600" />
                        <h3 className="mt-4 font-semibold">
                            {t('manufacturing.reports.material')}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {t('manufacturing.reports.materialDesc')}
                        </p>
                    </Card>
                </div>
            </div>
        </>
    );
}
