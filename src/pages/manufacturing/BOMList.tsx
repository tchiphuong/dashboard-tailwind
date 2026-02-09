import { useState, useMemo, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';
import {
    PageHeader,
    Button,
    Table,
    ConfirmModal,
    TableColumn,
    TableAction,
} from '@/components/common';

interface BOMItem {
    id: number;
    code: string;
    productName: string;
    version: string;
    componentsCount: number;
    status: 'active' | 'draft' | 'archived';
    createdAt: string;
    updatedBy: string;
}

const mockBOMs: BOMItem[] = [
    {
        id: 1,
        code: 'BOM-001',
        productName: 'Laptop Pro 15"',
        version: '2.0',
        componentsCount: 45,
        status: 'active',
        createdAt: '2024-01-15',
        updatedBy: 'admin',
    },
    {
        id: 2,
        code: 'BOM-002',
        productName: 'Wireless Mouse',
        version: '1.5',
        componentsCount: 12,
        status: 'active',
        createdAt: '2024-02-10',
        updatedBy: 'john',
    },
    {
        id: 3,
        code: 'BOM-003',
        productName: 'USB-C Hub',
        version: '1.0',
        componentsCount: 8,
        status: 'draft',
        createdAt: '2024-03-01',
        updatedBy: 'admin',
    },
];

export function BOMListPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const columns: TableColumn<BOMItem>[] = useMemo(
        () => [
            { key: 'code', label: t('manufacturing.bom.code') },
            { key: 'productName', label: t('manufacturing.bom.product') },
            { key: 'version', label: t('manufacturing.bom.version') },
            {
                key: 'componentsCount',
                label: t('manufacturing.bom.components'),
                render: (item) => <span className="font-medium">{item.componentsCount}</span>,
            },
            {
                key: 'status',
                label: t('common.status'),
                render: (item) => (
                    <Chip
                        size="sm"
                        variant="flat"
                        color={
                            item.status === 'active'
                                ? 'success'
                                : item.status === 'draft'
                                  ? 'warning'
                                  : 'default'
                        }
                    >
                        {item.status}
                    </Chip>
                ),
            },
        ],
        [t]
    );

    const actions: TableAction<BOMItem>[] = useMemo(
        () => [
            { key: 'view', label: t('common.view'), onClick: () => {} },
            { key: 'edit', label: t('common.edit'), onClick: () => {} },
            {
                key: 'delete',
                label: t('common.delete'),
                onClick: (item: { id: SetStateAction<number | null> }) => setDeleteId(item.id),
            },
        ],
        [t]
    );

    const filteredData = mockBOMs.filter(
        (item) =>
            item.code.toLowerCase().includes(search.toLowerCase()) ||
            item.productName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title={t('manufacturing.bom.title')}
                breadcrumbs={[
                    { label: t('nav.manufacturing'), href: '/manufacturing' },
                    { label: t('manufacturing.bom.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('manufacturing.bom.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
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

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => setDeleteId(null)}
                title={t('common.confirmDelete')}
                message={t('manufacturing.bom.deleteConfirm')}
            />
        </>
    );
}
