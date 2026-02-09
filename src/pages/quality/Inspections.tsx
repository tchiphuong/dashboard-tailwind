import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    PlusIcon,
    CheckBadgeIcon,
    DocumentCheckIcon,
    ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';
import { PageHeader, Card, Button, Table, TableColumn, TableAction } from '@/components/common';

interface QualityInspection {
    id: number;
    inspectionNumber: string;
    product: string;
    inspector: string;
    result: 'passed' | 'failed' | 'pending';
    defectsFound: number;
    inspectionDate: string;
}

const mockInspections: QualityInspection[] = [
    {
        id: 1,
        inspectionNumber: 'QC-2024-001',
        product: 'Laptop Pro 15"',
        inspector: 'John Doe',
        result: 'passed',
        defectsFound: 0,
        inspectionDate: '2024-01-20',
    },
    {
        id: 2,
        inspectionNumber: 'QC-2024-002',
        product: 'Wireless Mouse',
        inspector: 'Jane Smith',
        result: 'failed',
        defectsFound: 3,
        inspectionDate: '2024-01-22',
    },
    {
        id: 3,
        inspectionNumber: 'QC-2024-003',
        product: 'USB-C Hub',
        inspector: 'Bob Wilson',
        result: 'pending',
        defectsFound: 0,
        inspectionDate: '2024-01-25',
    },
];

export function QualityInspectionsPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const getResultColor = (result: QualityInspection['result']) => {
        switch (result) {
            case 'passed':
                return 'success';
            case 'failed':
                return 'danger';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<QualityInspection>[] = useMemo(
        () => [
            { key: 'inspectionNumber', label: t('quality.inspection.number') },
            { key: 'product', label: t('quality.inspection.product') },
            { key: 'inspector', label: t('quality.inspection.inspector') },
            {
                key: 'result',
                label: t('quality.inspection.result'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getResultColor(item.result)}>
                        {item.result}
                    </Chip>
                ),
            },
            {
                key: 'defectsFound',
                label: t('quality.inspection.defects'),
                render: (item) => (
                    <span className={item.defectsFound > 0 ? 'font-medium text-red-600' : ''}>
                        {item.defectsFound}
                    </span>
                ),
            },
            { key: 'inspectionDate', label: t('quality.inspection.date') },
        ],
        [t]
    );

    const actions: TableAction<QualityInspection>[] = useMemo(
        () => [
            { key: 'view', label: t('common.view'), onClick: () => {} },
            { key: 'edit', label: t('common.edit'), onClick: () => {} },
        ],
        [t]
    );

    const filteredData = mockInspections.filter(
        (item) =>
            item.inspectionNumber.toLowerCase().includes(search.toLowerCase()) ||
            item.product.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title={t('quality.inspection.title')}
                breadcrumbs={[
                    { label: t('nav.quality'), href: '/quality' },
                    { label: t('quality.inspection.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('quality.inspection.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('quality.stats.passed')}</p>
                                <p className="text-2xl font-bold text-green-600">156</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                                <DocumentCheckIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t('quality.stats.failed')}</p>
                                <p className="text-2xl font-bold text-red-600">12</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('quality.stats.pending')}
                                </p>
                                <p className="text-2xl font-bold text-yellow-600">8</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <Table
                    items={filteredData}
                    columns={columns}
                    getRowKey={(item) => item.id}
                    actions={actions}
                    emptyContent={t('common.noData')}
                    showSearch
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder={t('common.search')}
                />
            </div>
        </>
    );
}
