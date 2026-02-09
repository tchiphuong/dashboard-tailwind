import { useTranslation } from 'react-i18next';
import { PlusIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import { PageHeader, Card, Button } from '@/components/common';

export function QualityStandardsPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('quality.standards.title')}
                breadcrumbs={[
                    { label: t('nav.quality'), href: '/quality' },
                    { label: t('quality.standards.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('quality.standards.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                <Card className="p-6">
                    <div className="flex flex-col items-center justify-center py-12">
                        <DocumentCheckIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                            {t('quality.standards.title')}
                        </h3>
                        <p className="mt-2 text-center text-gray-500 dark:text-gray-400">
                            {t('quality.standards.description')}
                        </p>
                        <Button color="primary" className="mt-4">
                            {t('quality.standards.create')}
                        </Button>
                    </div>
                </Card>
            </div>
        </>
    );
}
