import {
    useState,
    useMemo,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
    ReactPortal,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, SelectItem, Card, CardBody, Divider, Progress } from '@heroui/react';
import {
    PlusIcon,
    CubeIcon,
    TruckIcon,
    BuildingStorefrontIcon,
    ArrowsRightLeftIcon,
    ClipboardDocumentListIcon,
    UserGroupIcon,
    DocumentCheckIcon,
    InboxArrowDownIcon,
} from '@heroicons/react/24/outline';
import {
    Select,
    PageHeader,
    Modal as CommonModal,
    ConfirmModal,
    Table,
    Input,
    TableColumn,
    TableAction,
    useTableData,
    FetchParams,
    PagedResult,
} from '@/components/common';

// ==================== TYPES ====================

interface StockItem {
    id: number;
    sku: string;
    name: string;
    category: string;
    warehouse: string;
    quantity: number;
    minStock: number;
    maxStock: number;
    unit: string;
    unitPrice: number;
    status: 'instock' | 'lowstock' | 'outofstock';
    lastUpdated: string;
}

interface Warehouse {
    id: number;
    code: string;
    name: string;
    address: string;
    manager: string;
    capacity: number;
    used: number;
    status: 'active' | 'inactive';
}

interface StockTransfer {
    id: number;
    transferCode: string;
    fromWarehouse: string;
    toWarehouse: string;
    items: number;
    status: 'pending' | 'intransit' | 'completed' | 'cancelled';
    requestDate: string;
    completedDate: string | null;
}

interface PurchaseOrder {
    id: number;
    poCode: string;
    supplier: string;
    items: number;
    total: number;
    status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
    orderDate: string;
    expectedDate: string;
}

interface Supplier {
    id: number;
    code: string;
    name: string;
    contact: string;
    email: string;
    phone: string;
    address: string;
    totalOrders: number;
    status: 'active' | 'inactive';
}

interface GoodsReceipt {
    id: number;
    receiptCode: string;
    poCode: string;
    supplier: string;
    items: number;
    warehouse: string;
    status: 'pending' | 'inspecting' | 'completed' | 'rejected';
    receivedDate: string;
}

// ==================== MOCK DATA ====================

const mockStock: StockItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    sku: `SKU${String(i + 1).padStart(5, '0')}`,
    name: `Sản phẩm ${i + 1}`,
    category: ['Điện tử', 'Văn phòng', 'Gia dụng', 'Thực phẩm', 'Khác'][i % 5],
    warehouse: ['Kho HN', 'Kho HCM', 'Kho ĐN'][i % 3],
    quantity: Math.floor(Math.random() * 500),
    minStock: 50,
    maxStock: 500,
    unit: ['Cái', 'Hộp', 'Thùng', 'Kg', 'Lít'][i % 5],
    unitPrice: (i + 1) * 50000,
    status: (['instock', 'lowstock', 'outofstock'] as const)[i % 3],
    lastUpdated: new Date(2024, 0, i + 1).toISOString().split('T')[0],
}));

const mockWarehouses: Warehouse[] = [
    {
        id: 1,
        code: 'WH-HN',
        name: 'Kho Hà Nội',
        address: '123 Cầu Giấy, Hà Nội',
        manager: 'Nguyễn Văn A',
        capacity: 10000,
        used: 7500,
        status: 'active',
    },
    {
        id: 2,
        code: 'WH-HCM',
        name: 'Kho TP.HCM',
        address: '456 Quận 7, TP.HCM',
        manager: 'Trần Thị B',
        capacity: 15000,
        used: 12000,
        status: 'active',
    },
    {
        id: 3,
        code: 'WH-DN',
        name: 'Kho Đà Nẵng',
        address: '789 Hải Châu, Đà Nẵng',
        manager: 'Lê Văn C',
        capacity: 5000,
        used: 2000,
        status: 'active',
    },
    {
        id: 4,
        code: 'WH-BN',
        name: 'Kho Bắc Ninh',
        address: '321 Từ Sơn, Bắc Ninh',
        manager: 'Phạm Thị D',
        capacity: 8000,
        used: 1000,
        status: 'inactive',
    },
];

const mockTransfers: StockTransfer[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    transferCode: `TF${String(i + 1).padStart(4, '0')}`,
    fromWarehouse: mockWarehouses[i % 3].name,
    toWarehouse: mockWarehouses[(i + 1) % 3].name,
    items: (i % 5) + 1,
    status: (['pending', 'intransit', 'completed', 'cancelled'] as const)[i % 4],
    requestDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    completedDate: i % 4 === 2 ? new Date(2024, 0, i + 3).toISOString().split('T')[0] : null,
}));

const mockPOs: PurchaseOrder[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    poCode: `PO${String(i + 1).padStart(5, '0')}`,
    supplier: `Nhà cung cấp ${(i % 10) + 1}`,
    items: (i % 8) + 1,
    total: (i + 1) * 1000000 + 5000000,
    status: (['draft', 'sent', 'confirmed', 'received', 'cancelled'] as const)[i % 5],
    orderDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    expectedDate: new Date(2024, 0, i + 7).toISOString().split('T')[0],
}));

const mockSuppliers: Supplier[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    code: `SUP${String(i + 1).padStart(3, '0')}`,
    name: `Nhà cung cấp ${i + 1}`,
    contact: `Liên hệ ${i + 1}`,
    email: `supplier${i + 1}@email.com`,
    phone: `0${800000000 + i}`,
    address: `Địa chỉ NCC ${i + 1}`,
    totalOrders: (i + 1) * 5,
    status: i % 5 === 0 ? 'inactive' : 'active',
}));

const mockReceipts: GoodsReceipt[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    receiptCode: `GR${String(i + 1).padStart(4, '0')}`,
    poCode: mockPOs[i % 10].poCode,
    supplier: mockPOs[i % 10].supplier,
    items: (i % 5) + 1,
    warehouse: mockWarehouses[i % 3].name,
    status: (['pending', 'inspecting', 'completed', 'rejected'] as const)[i % 4],
    receivedDate: new Date(2024, 0, i + 5).toISOString().split('T')[0],
}));

// ==================== FETCH FUNCTION ====================

const createFetchFn =
    <T,>(data: T[]) =>
    async (params: FetchParams): Promise<PagedResult<T>> => {
        await new Promise((r) => setTimeout(r, 300));
        let filtered = [...data];
        if (params.search) {
            const search = params.search.toLowerCase();
            filtered = filtered.filter((item) =>
                JSON.stringify(item).toLowerCase().includes(search)
            );
        }
        const start = (params.page - 1) * params.pageSize;
        const items = filtered.slice(start, start + params.pageSize);
        return {
            items,
            paging: {
                pageIndex: params.page,
                pageSize: params.pageSize,
                totalItems: filtered.length,
                totalPages: Math.ceil(filtered.length / params.pageSize),
            },
        };
    };

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

// ==================== STOCK OVERVIEW PAGE ====================

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
                render: (s: {
                    sku:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Iterable<ReactNode>
                        | null
                        | undefined;
                }) => <span className="font-mono text-blue-600">{s.sku}</span>,
            },
            { key: 'name', label: 'Sản phẩm' },
            { key: 'category', label: 'Danh mục' },
            { key: 'warehouse', label: 'Kho' },
            {
                key: 'quantity',
                label: 'Số lượng',
                render: (s: {
                    quantity:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Iterable<ReactNode>
                        | null
                        | undefined;
                    unit:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Iterable<ReactNode>
                        | null
                        | undefined;
                }) => (
                    <span className="font-semibold">
                        {s.quantity} {s.unit}
                    </span>
                ),
            },
            {
                key: 'unitPrice',
                label: 'Đơn giá',
                render: (s: { unitPrice: number }) => formatCurrency(s.unitPrice),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (s: { status: string }) => (
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
            {/* Stats cards */}
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
                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <span className="font-bold text-green-600">{stats.inStock}</span>
                        </div>
                        <p className="text-2xl font-bold text-green-600">{stats.inStock}</p>
                        <p className="text-sm text-gray-500">Còn hàng</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                            <span className="font-bold text-yellow-600">{stats.lowStock}</span>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
                        <p className="text-sm text-gray-500">Sắp hết</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="p-4 text-center">
                        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                            <span className="font-bold text-red-600">{stats.outOfStock}</span>
                        </div>
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
                getRowKey={(s: { id: any }) => s.id}
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

// ==================== STOCK ADJUSTMENT PAGE ====================

export function StockAdjustmentPage() {
    const { t } = useTranslation();
    const [adjustments, setAdjustments] = useState<
        { sku: string; name: string; current: number; adjust: number; reason: string }[]
    >([]);

    const addAdjustment = () =>
        setAdjustments([...adjustments, { sku: '', name: '', current: 0, adjust: 0, reason: '' }]);

    return (
        <>
            <PageHeader
                title={t('menu.stockAdjustment')}
                breadcrumbs={[
                    { label: t('menu.group.inventory') },
                    { label: t('menu.stock') },
                    { label: 'Điều chỉnh' },
                ]}
            />
            <Card className="mx-auto max-w-4xl">
                <CardBody className="space-y-4 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">Phiếu điều chỉnh tồn kho</h3>
                        <Button
                            color="primary"
                            variant="flat"
                            size="sm"
                            radius="full"
                            onPress={addAdjustment}
                            startContent={<PlusIcon className="h-4 w-4" />}
                        >
                            Thêm dòng
                        </Button>
                    </div>
                    <Select label="Kho" placeholder="Chọn kho" variant="bordered" radius="lg">
                        {mockWarehouses.map((w) => (
                            <SelectItem key={w.id}>{w.name}</SelectItem>
                        ))}
                    </Select>
                    <Select label="Loại điều chỉnh" variant="bordered" radius="lg">
                        <SelectItem key="increase">Tăng tồn kho</SelectItem>
                        <SelectItem key="decrease">Giảm tồn kho</SelectItem>
                        <SelectItem key="damage">Hàng hỏng</SelectItem>
                        <SelectItem key="inventory">Kiểm kê</SelectItem>
                    </Select>
                    <Divider />
                    {adjustments.length === 0 ? (
                        <div className="py-8 text-center text-gray-500">
                            Nhấn "Thêm dòng" để bắt đầu điều chỉnh
                        </div>
                    ) : (
                        adjustments.map((adj, i) => (
                            <div key={i} className="grid grid-cols-12 items-end gap-3">
                                <div className="col-span-3">
                                    <Input
                                        label="SKU"
                                        placeholder="SKU..."
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                                <div className="col-span-4">
                                    <Input
                                        label="Tên SP"
                                        placeholder="Tên sản phẩm"
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Input
                                        type="number"
                                        label="Số lượng"
                                        placeholder="0"
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <Input
                                        label="Ghi chú"
                                        placeholder="Lý do..."
                                        variant="bordered"
                                        radius="lg"
                                    />
                                </div>
                            </div>
                        ))
                    )}
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full">
                            Hủy
                        </Button>
                        <Button color="primary" radius="full">
                            Lưu điều chỉnh
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

// ==================== WAREHOUSES PAGE ====================

export function WarehousesPage() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <PageHeader
                title={t('menu.warehouses')}
                breadcrumbs={[
                    { label: t('menu.group.inventory') },
                    { label: t('menu.warehouses') },
                ]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm kho
                    </Button>
                }
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockWarehouses.map((wh) => (
                    <Card
                        key={wh.id}
                        className={`shadow-lg ${wh.status === 'inactive' ? 'opacity-60' : ''}`}
                    >
                        <CardBody className="p-6">
                            <div className="mb-4 flex items-start justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">{wh.name}</h3>
                                    <p className="text-sm text-gray-500">{wh.code}</p>
                                </div>
                                <Chip
                                    size="sm"
                                    color={wh.status === 'active' ? 'success' : 'default'}
                                    variant="flat"
                                >
                                    {wh.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                                </Chip>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p>
                                    <BuildingStorefrontIcon className="mr-2 inline h-4 w-4" />
                                    {wh.address}
                                </p>
                                <p>
                                    <UserGroupIcon className="mr-2 inline h-4 w-4" />
                                    Quản lý: {wh.manager}
                                </p>
                            </div>
                            <Divider className="my-4" />
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Sức chứa:</span>
                                    <span>
                                        {wh.used.toLocaleString()} / {wh.capacity.toLocaleString()}
                                    </span>
                                </div>
                                <Progress
                                    value={(wh.used / wh.capacity) * 100}
                                    color={
                                        wh.used / wh.capacity > 0.9
                                            ? 'danger'
                                            : wh.used / wh.capacity > 0.7
                                              ? 'warning'
                                              : 'success'
                                    }
                                />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="flat" radius="full" className="flex-1">
                                    Xem chi tiết
                                </Button>
                                <Button size="sm" variant="bordered" radius="full">
                                    Sửa
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
            <CommonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Thêm kho mới"
            >
                <div className="flex flex-col gap-4">
                    <Input label="Mã kho" placeholder="WH-XXX" variant="bordered" radius="lg" />
                    <Input label="Tên kho" placeholder="Kho ABC" variant="bordered" radius="lg" />
                    <Input
                        label="Địa chỉ"
                        placeholder="Địa chỉ đầy đủ"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Người quản lý"
                        placeholder="Tên người quản lý"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        type="number"
                        label="Sức chứa"
                        placeholder="10000"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}

// ==================== TRANSFERS PAGE ====================

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

// ==================== PURCHASE ORDER LIST PAGE ====================

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

// ==================== CREATE PURCHASE ORDER PAGE ====================

export function CreatePurchaseOrderPage() {
    const { t } = useTranslation();
    const [poItems, setPoItems] = useState<
        { sku: string; name: string; qty: number; price: number }[]
    >([{ sku: '', name: '', qty: 1, price: 0 }]);

    const addItem = () => setPoItems([...poItems, { sku: '', name: '', qty: 1, price: 0 }]);
    const totalAmount = poItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    return (
        <>
            <PageHeader
                title={t('menu.createPO')}
                breadcrumbs={[
                    { label: t('menu.group.purchase') },
                    { label: t('menu.purchaseOrders') },
                    { label: 'Tạo mới' },
                ]}
            />
            <Card className="mx-auto max-w-4xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold">
                        <ClipboardDocumentListIcon className="h-5 w-5" /> Thông tin đơn mua hàng
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Nhà cung cấp" variant="bordered" radius="lg" isRequired>
                            {mockSuppliers.map((s) => (
                                <SelectItem key={s.id}>{s.name}</SelectItem>
                            ))}
                        </Select>
                        <Select label="Kho nhận" variant="bordered" radius="lg">
                            {mockWarehouses.map((w) => (
                                <SelectItem key={w.id}>{w.name}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <Input type="date" label="Ngày dự kiến nhận" variant="bordered" radius="lg" />
                    <Divider />
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Danh sách sản phẩm</h4>
                        <Button
                            variant="flat"
                            size="sm"
                            radius="full"
                            onPress={addItem}
                            startContent={<PlusIcon className="h-4 w-4" />}
                        >
                            Thêm SP
                        </Button>
                    </div>
                    {poItems.map((item, i) => (
                        <div key={i} className="grid grid-cols-12 items-end gap-3">
                            <div className="col-span-3">
                                <Input
                                    label="SKU"
                                    placeholder="SKU..."
                                    variant="bordered"
                                    radius="lg"
                                />
                            </div>
                            <div className="col-span-4">
                                <Input
                                    label="Tên SP"
                                    placeholder="Tên sản phẩm"
                                    variant="bordered"
                                    radius="lg"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    type="number"
                                    label="SL"
                                    value={String(item.qty)}
                                    variant="bordered"
                                    radius="lg"
                                />
                            </div>
                            <div className="col-span-3">
                                <Input
                                    type="number"
                                    label="Đơn giá"
                                    placeholder="0"
                                    variant="bordered"
                                    radius="lg"
                                />
                            </div>
                        </div>
                    ))}
                    <Divider />
                    <div className="flex items-center justify-between text-lg font-bold">
                        <span>Tổng cộng:</span>
                        <span className="text-green-600">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/purchase/orders">
                            Hủy
                        </Button>
                        <Button color="default" variant="flat" radius="full">
                            Lưu nháp
                        </Button>
                        <Button color="primary" radius="full">
                            Gửi đơn hàng
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

// ==================== SUPPLIERS PAGE ====================

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

// ==================== RECEIPTS PAGE ====================

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
