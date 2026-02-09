import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    PlusIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';
import { PageHeader, Card, Button, Table, TableColumn, TableAction } from '@/components/common';

interface MaintenanceSchedule {
    id: number;
    assetName: string;
    assetCode: string;
    maintenanceType: 'preventive' | 'corrective' | 'predictive';
    frequency: string;
    lastMaintenance: string;
    nextMaintenance: string;
    status: 'on_schedule' | 'overdue' | 'upcoming';
    assignee: string;
}

const mockMaintenanceSchedules: MaintenanceSchedule[] = [
    {
        id: 1,
        assetName: 'CNC Machine #1',
        assetCode: 'CNC-001',
        maintenanceType: 'preventive',
        frequency: 'Monthly',
        lastMaintenance: '2024-01-15',
        nextMaintenance: '2024-02-15',
        status: 'on_schedule',
        assignee: 'Maintenance Team A',
    },
    {
        id: 2,
        assetName: 'Assembly Line Robot',
        assetCode: 'ROB-003',
        maintenanceType: 'predictive',
        frequency: 'Quarterly',
        lastMaintenance: '2023-12-01',
        nextMaintenance: '2024-01-25',
        status: 'overdue',
        assignee: 'Maintenance Team B',
    },
    {
        id: 3,
        assetName: 'HVAC System',
        assetCode: 'HVAC-001',
        maintenanceType: 'preventive',
        frequency: 'Bi-annually',
        lastMaintenance: '2023-10-01',
        nextMaintenance: '2024-04-01',
        status: 'upcoming',
        assignee: 'Facilities Team',
    },
];

export function MaintenanceSchedulePage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');

    const getStatusColor = (status: MaintenanceSchedule['status']) => {
        switch (status) {
            case 'on_schedule':
                return 'success';
            case 'overdue':
                return 'danger';
            case 'upcoming':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: MaintenanceSchedule['maintenanceType']) => {
        switch (type) {
            case 'preventive':
                return 'primary';
            case 'corrective':
                return 'danger';
            case 'predictive':
                return 'secondary';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<MaintenanceSchedule>[] = useMemo(
        () => [
            { key: 'assetName', label: t('maintenance.schedule.asset') },
            { key: 'assetCode', label: t('maintenance.schedule.code') },
            {
                key: 'maintenanceType',
                label: t('maintenance.schedule.type'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getTypeColor(item.maintenanceType)}>
                        {item.maintenanceType}
                    </Chip>
                ),
            },
            { key: 'frequency', label: t('maintenance.schedule.frequency') },
            { key: 'nextMaintenance', label: t('maintenance.schedule.nextDate') },
            {
                key: 'status',
                label: t('common.status'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getStatusColor(item.status)}>
                        {item.status.replace('_', ' ')}
                    </Chip>
                ),
            },
        ],
        [t]
    );

    const actions: TableAction<MaintenanceSchedule>[] = useMemo(
        () => [
            { key: 'view', label: t('common.view'), onClick: () => {} },
            { key: 'edit', label: t('common.edit'), onClick: () => {} },
        ],
        [t]
    );

    const filteredData = mockMaintenanceSchedules.filter(
        (item) =>
            item.assetName.toLowerCase().includes(search.toLowerCase()) ||
            item.assetCode.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title={t('maintenance.schedule.title')}
                breadcrumbs={[
                    { label: t('nav.maintenance'), href: '/maintenance' },
                    { label: t('maintenance.schedule.title') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('maintenance.schedule.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('maintenance.stats.onSchedule')}
                                </p>
                                <p className="text-2xl font-bold text-green-600">42</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('maintenance.stats.overdue')}
                                </p>
                                <p className="text-2xl font-bold text-red-600">3</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                <CalendarDaysIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('maintenance.stats.upcoming')}
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
