import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, TableAction, useTableData } from '@/components/common';
import { Lead, mockLeads, createFetchFn, formatCurrency } from './shared';

export function LeadListPage() {
    const { t } = useTranslation();
    const {
        items,
        isLoading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<Lead>({ fetchFn: createFetchFn(mockLeads), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'won':
                return 'success';
            case 'lost':
                return 'danger';
            case 'proposal':
                return 'primary';
            case 'qualified':
                return 'secondary';
            case 'contacted':
                return 'warning';
            default:
                return 'default';
        }
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case 'website':
                return 'Website';
            case 'referral':
                return 'Giới thiệu';
            case 'ads':
                return 'Quảng cáo';
            case 'social':
                return 'MXH';
            default:
                return 'Cold Call';
        }
    };

    const columns: TableColumn<Lead>[] = useMemo(
        () => [
            { key: 'name', label: 'Tên Lead' },
            { key: 'company', label: 'Công ty' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'SĐT' },
            {
                key: 'source',
                label: 'Nguồn',
                render: (l) => (
                    <Chip size="sm" variant="flat">
                        {getSourceLabel(l.source)}
                    </Chip>
                ),
            },
            {
                key: 'value',
                label: 'Giá trị',
                render: (l) => <span className="font-semibold">{formatCurrency(l.value)}</span>,
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (l) => (
                    <Chip size="sm" color={getStatusColor(l.status)} variant="flat">
                        {l.status === 'new'
                            ? 'Mới'
                            : l.status === 'contacted'
                              ? 'Đã liên hệ'
                              : l.status === 'qualified'
                                ? 'Đủ điều kiện'
                                : l.status === 'proposal'
                                  ? 'Đề xuất'
                                  : l.status === 'won'
                                    ? 'Thắng'
                                    : 'Mất'}
                    </Chip>
                ),
            },
            { key: 'assignedTo', label: 'Phụ trách' },
        ],
        []
    );

    const actions: TableAction<Lead>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'convert',
                label: 'Chuyển đổi',
                onClick: () => refresh(),
                isVisible: (l) => l.status === 'qualified' || l.status === 'proposal',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.leadList')}
                breadcrumbs={[{ label: t('menu.group.crm') }, { label: t('menu.leads') }]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/crm/leads/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm Lead
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(l) => l.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm lead..."
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: setPageSize,
                }}
                isHeaderSticky
                maxHeight="500px"
            />
        </>
    );
}
