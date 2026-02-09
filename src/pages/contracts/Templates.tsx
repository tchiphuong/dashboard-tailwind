import { useTranslation } from 'react-i18next';
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { PageHeader, Card, Button } from '@/components/common';

export function ContractTemplatesPage() {
    const { t } = useTranslation();

    const templates = [
        { id: 1, name: 'Sales Contract', type: 'sales', usageCount: 45 },
        { id: 2, name: 'Service Agreement', type: 'service', usageCount: 32 },
        { id: 3, name: 'Employment Contract', type: 'employment', usageCount: 28 },
        { id: 4, name: 'NDA Template', type: 'other', usageCount: 56 },
        { id: 5, name: 'Purchase Agreement', type: 'purchase', usageCount: 19 },
    ];

    return (
        <>
            <PageHeader
                title={t('contracts.templates.title')}
                breadcrumbs={[
                    { label: t('nav.contracts'), href: '/contracts' },
                    { label: t('contracts.templates.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('contracts.templates.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className="cursor-pointer p-6 transition-shadow hover:shadow-lg"
                        >
                            <DocumentTextIcon className="h-10 w-10 text-blue-600" />
                            <h3 className="mt-4 font-semibold">{template.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {t('contracts.templates.usedTimes', { count: template.usageCount })}
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="flat" color="primary">
                                    {t('common.use')}
                                </Button>
                                <Button size="sm" variant="light">
                                    {t('common.edit')}
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
