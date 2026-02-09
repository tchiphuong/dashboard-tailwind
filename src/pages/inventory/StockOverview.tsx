import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip, Card, CardBody } from '@heroui/react';
import { CubeIcon } from '@heroicons/react/24/outline';
import { PageHeader, Table, TableColumn, useTableData } from '@/components/common';
import { StockItem, mockStock, createFetchFn, formatCurrency } from './shared';

export function StockOverviewPage() {
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
    } = useTableData<StockItem>({ fetchFn: createFetchFn(mockStock), initialPageSize: 10 });

    const stats = useMemo(
        () => ({
            total: mockStock.length,
            inStock: mockStock.filter((s) => s.status === 'instock').length,
            lowStock: mockStock.filter((s) => s.status === 'lowstock').length,
            outOfStock: mockStock.filter((s) => s.status === 'outofstock').length,
            totalValue: mockStock.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0),
        }),
        []
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'instock':
                return 'success';
            case 'lowstock':
                return 'warning';
            default:
                return 'danger';
        }
    };

    const columns: TableColumn<StockItem>[] = useMemo(
        () => [
            {
                key: 'sku',
                label: 'SKU',
                width: 110,
                render: (s) => <span className="font-mono text-blue-600">{s.sku}</span>,
            },
            { key: 'name', label: 'Sản phẩm' },
            { key: 'category', label: 'Danh mục' },
            { key: 'warehouse', label: 'Kho' },
            {
                key: 'quantity',
                label: 'Số lượng',
                render: (s) => (
                    <span className="font-semibold">
                        {s.quantity} {s.unit}
                    </span>
                ),
            },
            { key: 'unitPrice', label: 'Đơn giá', render: (s) => formatCurrency(s.unitPrice) },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (s) => (
                    <Chip size="sm" color={getStatusColor(s.status)} variant="flat">
                        {s.status === 'instock'
                            ? 'Còn hàng'
                            : s.status === 'lowstock'
                              ? 'Sắp hết'
                              : 'Hết hàng'}
                    </Chip>
                ),
            },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.stockOverview')}
                breadcrumbs={[{ label: t('menu.group.inventory') }, { label: t('menu.stock') }]}
            />
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
                <Card>
                    <CardBody className="p-4 text-center">
                        <CubeIcon className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                        <p className="text-2xl font-bold">{stats.total}</p>
                        <p className="text-sm text-gray-500">Tổng SP</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
                        <p className="text-sm text-gray-500">Còn hàng</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
                        <p className="text-sm text-gray-500">Sắp hết</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                        <p className="text-sm text-gray-500">Hết hàng</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <p className="mb-1 text-sm text-gray-500">Giá trị tồn kho</p>
                        <p className="text-xl font-bold text-green-600">
                            {formatCurrency(stats.totalValue)}
                        </p>
                    </CardBody>
                </Card>
            </div>
            <Table
                items={items}
                columns={columns}
                getRowKey={(s) => s.id}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm sản phẩm..."
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
                maxHeight="400px"
            />
        </>
    );
}
