import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@heroui/react';
import { PageHeader, Table, TableColumn, TableAction, useTableData } from '@/components/common';
import { GoodsReceipt, mockReceipts, createFetchFn } from './shared';

export function ReceiptsPage() {
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
    } = useTableData<GoodsReceipt>({ fetchFn: createFetchFn(mockReceipts), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'inspecting':
                return 'primary';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<GoodsReceipt>[] = useMemo(
        () => [
            {
                key: 'receiptCode',
                label: 'Mã phiếu',
                width: 100,
                render: (r) => <span className="font-mono text-blue-600">{r.receiptCode}</span>,
            },
            {
                key: 'poCode',
                label: 'Mã PO',
                render: (r) => <span className="font-mono">{r.poCode}</span>,
            },
            { key: 'supplier', label: 'NCC' },
            { key: 'items', label: 'Số SP' },
            { key: 'warehouse', label: 'Kho nhận' },
            { key: 'receivedDate', label: 'Ngày nhận' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (r) => (
                    <Chip size="sm" color={getStatusColor(r.status)} variant="flat">
                        {r.status === 'pending'
                            ? 'Chờ nhận'
                            : r.status === 'inspecting'
                              ? 'Đang kiểm'
                              : r.status === 'completed'
                                ? 'Hoàn thành'
                                : 'Từ chối'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<GoodsReceipt>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'complete',
                label: 'Hoàn thành',
                onClick: () => refresh(),
                isVisible: (r) => r.status === 'inspecting',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.receipts')}
                breadcrumbs={[{ label: t('menu.group.purchase') }, { label: t('menu.receipts') }]}
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(r) => r.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm phiếu nhập..."
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
