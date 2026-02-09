import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';
import { PageHeader, Button, Table, TableColumn, TableAction } from '@/components/common';

interface MaintenanceRequest {
    id: number;
    requestNumber: string;
    title: string;
    asset: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    requestedBy: string;
    requestedDate: string;
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
    {
        id: 1,
        requestNumber: 'MR-2024-001',
        title: 'CNC Machine unusual noise',
        asset: 'CNC-001',
        priority: 'high',
        status: 'in_progress',
        requestedBy: 'John Doe',
        requestedDate: '2024-01-20',
    },
    {
        id: 2,
        requestNumber: 'MR-2024-002',
        title: 'Office AC not cooling',
        asset: 'HVAC-002',
        priority: 'medium',
        status: 'open',
        requestedBy: 'Jane Smith',
        requestedDate: '2024-01-22',
    },
    {
        id: 3,
        requestNumber: 'MR-2024-003',
        title: 'Forklift battery replacement',
        asset: 'FLT-005',
        priority: 'low',
        status: 'completed',
        requestedBy: 'Bob Wilson',
        requestedDate: '2024-01-18',
    },
];

export function MaintenanceRequestsPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
        switch (priority) {
            case 'critical':
                return 'danger';
            case 'high':
                return 'warning';
            case 'medium':
                return 'primary';
            case 'low':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusColor = (status: MaintenanceRequest['status']) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'primary';
            case 'open':
                return 'warning';
            case 'cancelled':
                return 'default';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<MaintenanceRequest>[] = useMemo(
        () => [
            { key: 'requestNumber', label: t('maintenance.request.number') },
            { key: 'title', label: t('maintenance.request.title') },
            { key: 'asset', label: t('maintenance.request.asset') },
            {
                key: 'priority',
                label: t('maintenance.request.priority'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getPriorityColor(item.priority)}>
                        {item.priority}
                    </Chip>
                ),
            },
            {
                key: 'status',
                label: t('common.status'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                    </Chip>
                ),
            },
            { key: 'requestedDate', label: t('maintenance.request.date') },
        ],
        [t]
    );

    const actions: TableAction<MaintenanceRequest>[] = useMemo(
        () => [
            { key: 'view', label: t('common.view'), onClick: () => {} },
            { key: 'edit', label: t('common.edit'), onClick: () => {} },
        ],
        [t]
    );

    const filteredData = mockMaintenanceRequests.filter(
        (item) =>
            item.requestNumber.toLowerCase().includes(search.toLowerCase()) ||
            item.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title={t('maintenance.request.title')}
                breadcrumbs={[
                    { label: t('nav.maintenance'), href: '/maintenance' },
                    { label: t('maintenance.request.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('maintenance.request.create')}
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
        </>
    );
}
