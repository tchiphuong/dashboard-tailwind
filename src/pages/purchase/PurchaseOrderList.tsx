import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, useTableData } from '@/components/common';
import { PurchaseOrder, mockPOs, createFetchFn, formatCurrency } from './shared';

export function PurchaseOrderListPage() {
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
    } = useTableData<PurchaseOrder>({ fetchFn: createFetchFn(mockPOs), initialPageSize: 10 });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'received':
                return 'success';
            case 'cancelled':
                return 'danger';
            case 'confirmed':
                return 'primary';
            case 'sent':
                return 'secondary';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<PurchaseOrder>[] = useMemo(
        () => [
            {
                key: 'poCode',
                label: 'Mã PO',
                width: 120,
                render: (po) => <span className="font-mono text-blue-600">{po.poCode}</span>,
            },
            { key: 'supplier', label: 'Nhà cung cấp' },
            { key: 'items', label: 'Số SP' },
            {
                key: 'total',
                label: 'Tổng tiền',
                render: (po) => <span className="font-semibold">{formatCurrency(po.total)}</span>,
            },
            { key: 'orderDate', label: 'Ngày đặt' },
            { key: 'expectedDate', label: 'Dự kiến nhận' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (po) => (
                    <Chip size="sm" color={getStatusColor(po.status)} variant="flat">
                        {po.status === 'draft'
                            ? 'Nháp'
                            : po.status === 'sent'
                              ? 'Đã gửi'
                              : po.status === 'confirmed'
                                ? 'Xác nhận'
                                : po.status === 'received'
                                  ? 'Đã nhận'
                                  : 'Đã hủy'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.poList')}
                breadcrumbs={[
                    { label: t('menu.group.purchase') },
                    { label: t('menu.purchaseOrders') },
                ]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/purchase/orders/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo PO
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(po) => po.id}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm PO..."
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
