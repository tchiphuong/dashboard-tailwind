import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, SelectItem } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
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
import { ITAsset, mockITAssets, createFetchFn } from './shared';

export function ITAssetsPage() {
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
    } = useTableData<ITAsset>({ fetchFn: createFetchFn(mockITAssets), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'inuse':
                return 'primary';
            case 'maintenance':
                return 'warning';
            default:
                return 'danger';
        }
    };

    const columns: TableColumn<ITAsset>[] = useMemo(
        () => [
            {
                key: 'assetTag',
                label: 'Mã TS',
                width: 100,
                render: (a) => <span className="font-mono text-blue-600">{a.assetTag}</span>,
            },
            { key: 'name', label: 'Tên thiết bị' },
            {
                key: 'type',
                label: 'Loại',
                render: (a) => (
                    <Chip size="sm" variant="flat">
                        {a.type}
                    </Chip>
                ),
            },
            { key: 'brand', label: 'Hãng' },
            {
                key: 'serial',
                label: 'Serial',
                render: (a) => (
                    <span className="font-mono text-xs">{a.serial.slice(0, 10)}...</span>
                ),
            },
            {
                key: 'assignedTo',
                label: 'Người sử dụng',
                render: (a) => a.assignedTo || <span className="text-gray-400">Chưa gán</span>,
            },
            { key: 'location', label: 'Vị trí' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (a) => (
                    <Chip size="sm" color={getStatusColor(a.status)} variant="flat">
                        {a.status === 'available'
                            ? 'Sẵn sàng'
                            : a.status === 'inuse'
                              ? 'Đang dùng'
                              : a.status === 'maintenance'
                                ? 'Bảo trì'
                                : 'Thanh lý'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<ITAsset>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'assign',
                label: 'Gán',
                onClick: () => {},
                isVisible: (a) => a.status === 'available',
            },
            { key: 'edit', label: 'Sửa', onClick: () => {} },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.itAssets')}
                breadcrumbs={[{ label: t('menu.group.it') }, { label: 'Tài sản IT' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm tài sản
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(a) => a.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm tài sản..."
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
                title="Thêm tài sản IT"
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Tên thiết bị"
                        placeholder="MacBook Pro 14 inch"
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Loại" variant="bordered" radius="lg">
                            <SelectItem key="laptop">Laptop</SelectItem>
                            <SelectItem key="desktop">Desktop</SelectItem>
                            <SelectItem key="monitor">Màn hình</SelectItem>
                            <SelectItem key="printer">Máy in</SelectItem>
                            <SelectItem key="phone">Điện thoại</SelectItem>
                            <SelectItem key="other">Khác</SelectItem>
                        </Select>
                        <Input label="Hãng" placeholder="Apple" variant="bordered" radius="lg" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Model" placeholder="A2442" variant="bordered" radius="lg" />
                        <Input
                            label="Serial"
                            placeholder="C02X..."
                            variant="bordered"
                            radius="lg"
                        />
                    </div>
                    <Input type="date" label="Ngày mua" variant="bordered" radius="lg" />
                </div>
            </CommonModal>
        </>
    );
}
