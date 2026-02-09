import { useState, useMemo, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
    PlusIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    CheckCircleIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import { Chip } from '@heroui/react';
import {
    PageHeader,
    Card,
    Button,
    Table,
    ConfirmModal,
    TableColumn,
    TableAction,
} from '@/components/common';

interface Contract {
    id: number;
    contractNumber: string;
    title: string;
    partner: string;
    type: 'sales' | 'purchase' | 'service' | 'employment';
    value: number;
    status: 'active' | 'expired' | 'pending' | 'terminated';
    startDate: string;
    endDate: string;
}

const mockContracts: Contract[] = [
    {
        id: 1,
        contractNumber: 'CTR-2024-001',
        title: 'Annual IT Support Agreement',
        partner: 'TechCorp Ltd',
        type: 'service',
        value: 50000,
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
    },
    {
        id: 2,
        contractNumber: 'CTR-2024-002',
        title: 'Product Supply Agreement',
        partner: 'SupplyChain Inc',
        type: 'purchase',
        value: 120000,
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2025-01-14',
    },
    {
        id: 3,
        contractNumber: 'CTR-2023-015',
        title: 'Marketing Services',
        partner: 'AdAgency Pro',
        type: 'service',
        value: 25000,
        status: 'expired',
        startDate: '2023-06-01',
        endDate: '2023-12-31',
    },
];

export function ContractListPage() {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const getStatusColor = (status: Contract['status']) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'expired':
                return 'default';
            case 'pending':
                return 'warning';
            case 'terminated':
                return 'danger';
            default:
                return 'default';
        }
    };

    const getTypeColor = (type: Contract['type']) => {
        switch (type) {
            case 'sales':
                return 'primary';
            case 'purchase':
                return 'secondary';
            case 'service':
                return 'success';
            case 'employment':
                return 'warning';
            default:
                return 'default';
        }
    };

    const columns: TableColumn<Contract>[] = useMemo(
        () => [
            { key: 'contractNumber', label: t('contracts.number') },
            { key: 'title', label: t('contracts.title') },
            { key: 'partner', label: t('contracts.partner') },
            {
                key: 'type',
                label: t('contracts.type'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getTypeColor(item.type)}>
                        {item.type}
                    </Chip>
                ),
            },
            {
                key: 'value',
                label: t('contracts.value'),
                render: (item) => (
                    <span className="font-medium">${item.value.toLocaleString()}</span>
                ),
            },
            {
                key: 'status',
                label: t('common.status'),
                render: (item) => (
                    <Chip size="sm" variant="flat" color={getStatusColor(item.status)}>
                        {item.status}
                    </Chip>
                ),
            },
            { key: 'endDate', label: t('contracts.endDate') },
        ],
        [t]
    );

    const actions: TableAction<Contract>[] = useMemo(
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

    const filteredData = mockContracts.filter(
        (item) =>
            item.contractNumber.toLowerCase().includes(search.toLowerCase()) ||
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.partner.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <PageHeader
                title={t('contracts.title')}
                breadcrumbs={[
                    { label: t('nav.contracts'), href: '/contracts' },
                    { label: t('contracts.list') },
                ]}
                actions={
                    <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                        {t('contracts.create')}
                    </Button>
                }
            />

            <div className="grid gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('contracts.stats.active')}
                                </p>
                                <p className="text-2xl font-bold">24</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/30">
                                <ClockIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('contracts.stats.expiringSoon')}
                                </p>
                                <p className="text-2xl font-bold">5</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-gray-100 p-2 dark:bg-gray-900/30">
                                <DocumentTextIcon className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('contracts.stats.expired')}
                                </p>
                                <p className="text-2xl font-bold">12</p>
                            </div>
                        </div>
                    </Card>
                    <Card className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                                <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    {t('contracts.stats.totalValue')}
                                </p>
                                <p className="text-2xl font-bold">$1.2M</p>
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

            <ConfirmModal
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={() => setDeleteId(null)}
                title={t('common.confirmDelete')}
                message={t('contracts.deleteConfirm')}
            />
        </>
    );
}
