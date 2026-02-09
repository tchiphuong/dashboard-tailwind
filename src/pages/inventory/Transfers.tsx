import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, SelectItem } from '@heroui/react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import {
    PageHeader,
    Modal as CommonModal,
    Table,
    Input,
    Select,
    TableColumn,
    TableAction,
    useTableData,
} from '@/components/common';
import { StockTransfer, mockTransfers, mockWarehouses, createFetchFn } from './shared';

export function TransfersPage() {
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
    } = useTableData<StockTransfer>({ fetchFn: createFetchFn(mockTransfers), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'danger';
            case 'intransit':
                return 'primary';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<StockTransfer>[] = useMemo(
        () => [
            {
                key: 'transferCode',
                label: 'Mã chuyển',
                width: 100,
                render: (tf) => <span className="font-mono text-blue-600">{tf.transferCode}</span>,
            },
            { key: 'fromWarehouse', label: 'Từ kho' },
            { key: 'toWarehouse', label: 'Đến kho' },
            { key: 'items', label: 'Số SP' },
            { key: 'requestDate', label: 'Ngày tạo' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (tf) => (
                    <Chip size="sm" color={getStatusColor(tf.status)} variant="flat">
                        {tf.status === 'pending'
                            ? 'Chờ xử lý'
                            : tf.status === 'intransit'
                              ? 'Đang chuyển'
                              : tf.status === 'completed'
                                ? 'Hoàn thành'
                                : 'Đã hủy'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<StockTransfer>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'complete',
                label: 'Hoàn thành',
                onClick: () => refresh(),
                isVisible: (tf) => tf.status === 'intransit',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.transfers')}
                breadcrumbs={[{ label: t('menu.group.inventory') }, { label: t('menu.transfers') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<ArrowsRightLeftIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo chuyển kho
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(tf) => tf.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
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
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tạo phiếu chuyển kho"
            >
                <div className="flex flex-col gap-4">
                    <Select label="Từ kho" variant="bordered" radius="lg">
                        {mockWarehouses.map((w) => (
                            <SelectItem key={w.id}>{w.name}</SelectItem>
                        ))}
                    </Select>
                    <Select label="Đến kho" variant="bordered" radius="lg">
                        {mockWarehouses.map((w) => (
                            <SelectItem key={w.id}>{w.name}</SelectItem>
                        ))}
                    </Select>
                    <Input
                        label="Ghi chú"
                        placeholder="Ghi chú..."
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}
