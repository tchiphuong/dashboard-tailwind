import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
    PageHeader,
    Modal as CommonModal,
    Table,
    Input,
    TableColumn,
    TableAction,
    useTableData,
} from '@/components/common';
import { Supplier, mockSuppliers, createFetchFn } from './shared';

export function SuppliersPage() {
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
    } = useTableData<Supplier>({ fetchFn: createFetchFn(mockSuppliers), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns: TableColumn<Supplier>[] = useMemo(
        () => [
            {
                key: 'code',
                label: 'Mã NCC',
                width: 100,
                render: (s) => <span className="font-mono text-blue-600">{s.code}</span>,
            },
            { key: 'name', label: 'Tên NCC' },
            { key: 'contact', label: 'Liên hệ' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'SĐT' },
            { key: 'totalOrders', label: 'Đơn hàng' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (s) => (
                    <Chip
                        size="sm"
                        color={s.status === 'active' ? 'success' : 'danger'}
                        variant="flat"
                    >
                        {s.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<Supplier>[] = useMemo(
        () => [
            { key: 'edit', label: 'Sửa', onClick: () => {} },
            { key: 'view', label: 'Xem', onClick: () => {} },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.suppliers')}
                breadcrumbs={[{ label: t('menu.group.purchase') }, { label: t('menu.suppliers') }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm NCC
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(s) => s.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm NCC..."
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
                title="Thêm nhà cung cấp"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Tên NCC"
                        placeholder="Công ty ABC"
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Người liên hệ"
                            placeholder="Nguyễn Văn A"
                            variant="bordered"
                            radius="lg"
                        />
                        <Input
                            label="SĐT"
                            placeholder="0901234567"
                            variant="bordered"
                            radius="lg"
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="contact@supplier.com"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Địa chỉ"
                        placeholder="Địa chỉ đầy đủ"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}
