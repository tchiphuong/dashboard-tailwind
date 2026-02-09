import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    PlusIcon,
    CubeIcon,
    ClipboardDocumentListIcon,
    CalendarDaysIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { Chip, Progress } from '@heroui/react';
import { PageHeader, Card, Button, Table, TableColumn, TableAction } from '@/components/common';

interface WorkOrder {
    id: number;
    orderNumber: string;
    product: string;
    quantity: number;
    progress: number;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    startDate: string;
    dueDate: string;
    assignee: string;
}

const mockWorkOrders: WorkOrder[] = [
    {
        id: 1,
        orderNumber: 'WO-2024-001',
        product: 'Laptop Pro 15"',
        quantity: 100,
        progress: 75,
        status: 'in_progress',
        startDate: '2024-01-10',
        dueDate: '2024-02-10',
        assignee: 'Production Team A',
    },
    {
        id: 2,
        orderNumber: 'WO-2024-002',
        product: 'Wireless Mouse',
        quantity: 500,
        progress: 100,
        status: 'completed',
        startDate: '2024-01-15',
        dueDate: '2024-01-30',
        assignee: 'Production Team B',
    },
    {
        id: 3,
        orderNumber: 'WO-2024-003',
        product: 'USB-C Hub',
        quantity: 200,
        progress: 0,
        status: 'pending',
        startDate: '2024-02-01',
        dueDate: '2024-02-28',
        assignee: 'Production Team A',
    },
];

export function WorkOrdersPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const getStatusColor = (status: WorkOrder['status']) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in_progress':
                return 'primary';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'danger';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<WorkOrder>[] = useMemo(
        () => [
            { key: 'orderNumber', label: t('manufacturing.workOrder.number') },
            { key: 'product', label: t('manufacturing.workOrder.product') },
            { key: 'quantity', label: t('manufacturing.workOrder.quantity') },
            {
                key: 'progress',
                label: t('manufacturing.workOrder.progress'),
                render: (item) => (
                    <div className="flex items-center gap-2">
                        <Progress
                            size="sm"
                            value={item.progress}
                            color={item.progress === 100 ? 'success' : 'primary'}
                            className="max-w-24"
                        />
                        <span className="text-sm">{item.progress}%</span>
                    </div>
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
            { key: 'dueDate', label: t('manufacturing.workOrder.dueDate') },
        ],
        [t]
    );

    const actions: TableAction<WorkOrder>[] = useMemo(
        () => [
            { key: 'view', label: t('common.view'), onClick: () => {} },
            { key: 'edit', label: t('common.edit'), onClick: () => {} },
        ],
        [t]
    );

    const filteredData = mockWorkOrders.filter(
        (item) =>
            item.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
            item.product.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title={t('manufacturing.workOrder.title')}
                breadcrumbs={[
                    { label: t('nav.manufacturing'), href: '/manufacturing' },
                    { label: t('manufacturing.workOrder.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('manufacturing.workOrder.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('manufacturing.stats.total')}
                                </p>
                                <p className="text-2xl font-bold">24</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('manufacturing.stats.completed')}
                                </p>
                                <p className="text-2xl font-bold">18</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                <CubeIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('manufacturing.stats.inProgress')}
                                </p>
                                <p className="text-2xl font-bold">4</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                                <CalendarDaysIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('manufacturing.stats.pending')}
                                </p>
                                <p className="text-2xl font-bold">2</p>
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
