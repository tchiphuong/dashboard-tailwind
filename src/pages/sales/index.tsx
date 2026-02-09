import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip, SelectItem, Card, CardBody, Divider, Avatar } from '@heroui/react';
import {
    PlusIcon,
    ShoppingCartIcon,
    UserIcon,
    DocumentTextIcon,
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

interface Order {
    id: number;
    orderCode: string;
    customerName: string;
    customerPhone: string;
    items: number;
    total: number;
    status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
    paymentStatus: 'unpaid' | 'paid' | 'refunded';
    orderDate: string;
    deliveryDate: string | null;
}

interface Customer {
    id: number;
    customerCode: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    status: 'active' | 'inactive';
    createdAt: string;
}

interface SalesQuote {
    id: number;
    quoteCode: string;
    customerName: string;
    items: number;
    subtotal: number;
    discount: number;
    total: number;
    validUntil: string;
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
    createdAt: string;
}

// ==================== MOCK DATA ====================

const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    orderCode: `ORD${String(i + 1).padStart(5, '0')}`,
    customerName: `Khách hàng ${i + 1}`,
    customerPhone: `0${900000000 + i}`,
    items: (i % 5) + 1,
    total: (i + 1) * 500000 + 1000000,
    status: ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'][
        i % 5
    ] as Order['status'],
    paymentStatus: ['unpaid', 'paid', 'paid', 'paid', 'refunded'][i % 5] as Order['paymentStatus'],
    orderDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    deliveryDate: i % 5 === 3 ? new Date(2024, 0, i + 5).toISOString().split('T')[0] : null,
}));

const mockCustomers: Customer[] = Array.from({ length: 40 }, (_, i) => ({
    id: i + 1,
    customerCode: `KH${String(i + 1).padStart(4, '0')}`,
    name: `${['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng'][i % 5]} ${['Văn', 'Thị', 'Minh', 'Hồng', 'Quốc'][i % 5]} ${String.fromCharCode(65 + (i % 26))}`,
    email: `customer${i + 1}@email.com`,
    phone: `0${900000000 + i}`,
    company: ['Công ty ABC', 'Công ty XYZ', 'Công ty 123', 'Cá nhân', 'Startup VN'][i % 5],
    address: `${i + 1} Đường ${(i % 10) + 1}, Quận ${(i % 12) + 1}, TP.HCM`,
    totalOrders: (i % 20) + 1,
    totalSpent: (i + 1) * 2000000,
    status: i % 10 === 0 ? 'inactive' : 'active',
    createdAt: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0],
}));

const mockQuotes: SalesQuote[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    quoteCode: `QT${String(i + 1).padStart(4, '0')}`,
    customerName: mockCustomers[i % 20].name,
    items: (i % 8) + 1,
    subtotal: (i + 1) * 1000000 + 5000000,
    discount: (i % 3) * 500000,
    total: (i + 1) * 1000000 + 5000000 - (i % 3) * 500000,
    validUntil: new Date(2024, 1, i + 15).toISOString().split('T')[0],
    status: ['draft', 'sent', 'accepted', 'rejected', 'expired'][i % 5] as SalesQuote['status'],
    createdAt: new Date(2024, 0, i + 1).toISOString().split('T')[0],
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

// ==================== ORDERS LIST PAGE ====================

export function OrdersListPage() {
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
    } = useTableData<Order>({ fetchFn: createFetchFn(mockOrders), initialPageSize: 10 });
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'danger';
            case 'shipping':
                return 'primary';
            case 'confirmed':
                return 'secondary';
            default:
                return 'warning';
        }
    };

    const getPaymentColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'refunded':
                return 'danger';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<Order>[] = useMemo(
        () => [
            {
                key: 'orderCode',
                label: 'Mã đơn',
                width: 120,
                render: (o) => (
                    <span className="font-mono font-medium text-blue-600">{o.orderCode}</span>
                ),
            },
            { key: 'customerName', label: 'Khách hàng' },
            { key: 'items', label: 'SP', width: 60 },
            {
                key: 'total',
                label: 'Tổng tiền',
                render: (o) => <span className="font-semibold">{formatCurrency(o.total)}</span>,
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (o) => (
                    <Chip size="sm" color={getStatusColor(o.status)} variant="flat">
                        {o.status === 'pending'
                            ? 'Chờ xác nhận'
                            : o.status === 'confirmed'
                              ? 'Đã xác nhận'
                              : o.status === 'shipping'
                                ? 'Đang giao'
                                : o.status === 'delivered'
                                  ? 'Đã giao'
                                  : 'Đã hủy'}
                    </Chip>
                ),
            },
            {
                key: 'paymentStatus',
                label: 'Thanh toán',
                render: (o) => (
                    <Chip size="sm" color={getPaymentColor(o.paymentStatus)} variant="flat">
                        {o.paymentStatus === 'paid'
                            ? 'Đã TT'
                            : o.paymentStatus === 'refunded'
                              ? 'Hoàn tiền'
                              : 'Chưa TT'}
                    </Chip>
                ),
            },
            { key: 'orderDate', label: 'Ngày đặt' },
        ],
        []
    );

    const actions: TableAction<Order>[] = useMemo(
        () => [
            {
                key: 'view',
                label: 'Xem',
                onClick: (o) => {
                    setSelectedOrder(o);
                    setIsViewOpen(true);
                },
            },
            { key: 'edit', label: 'Sửa', onClick: () => {} },
        ],
        []
    );

    return (
        <>
            <PageHeader
                title={t('menu.orderList')}
                breadcrumbs={[{ label: t('menu.group.sales') }, { label: t('menu.orders') }]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/sales/orders/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo đơn hàng
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(o) => o.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm đơn hàng..."
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
                isOpen={isViewOpen}
                onClose={() => setIsViewOpen(false)}
                title={`Chi tiết đơn hàng ${selectedOrder?.orderCode}`}
            >
                {selectedOrder && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Khách hàng:</span>{' '}
                                <strong>{selectedOrder.customerName}</strong>
                            </div>
                            <div>
                                <span className="text-gray-500">SĐT:</span>{' '}
                                {selectedOrder.customerPhone}
                            </div>
                            <div>
                                <span className="text-gray-500">Ngày đặt:</span>{' '}
                                {selectedOrder.orderDate}
                            </div>
                            <div>
                                <span className="text-gray-500">Số SP:</span> {selectedOrder.items}
                            </div>
                        </div>
                        <Divider />
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">Tổng tiền:</span>
                            <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(selectedOrder.total)}
                            </span>
                        </div>
                    </div>
                )}
            </CommonModal>
        </>
    );
}

// ==================== CREATE ORDER PAGE ====================

export function CreateOrderPage() {
    const { t } = useTranslation();
    const [step, setStep] = useState(1);
    const [orderItems, setOrderItems] = useState<{ name: string; qty: number; price: number }[]>([
        { name: 'Sản phẩm 1', qty: 1, price: 500000 },
    ]);

    const addItem = () => setOrderItems([...orderItems, { name: '', qty: 1, price: 0 }]);
    const removeItem = (index: number) => setOrderItems(orderItems.filter((_, i) => i !== index));
    const totalAmount = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);

    return (
        <>
            <PageHeader
                title={t('menu.createOrder')}
                breadcrumbs={[
                    { label: t('menu.group.sales') },
                    { label: t('menu.orders') },
                    { label: 'Tạo mới' },
                ]}
            />
            <Card className="mx-auto max-w-4xl">
                <CardBody className="p-6">
                    {/* Steps indicator */}
                    <div className="mb-8 flex items-center justify-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                                >
                                    {s}
                                </div>
                                <span
                                    className={
                                        step >= s ? 'font-medium text-blue-600' : 'text-gray-500'
                                    }
                                >
                                    {s === 1 ? 'Khách hàng' : s === 2 ? 'Sản phẩm' : 'Xác nhận'}
                                </span>
                                {s < 3 && (
                                    <div className="h-0.5 w-12 bg-gray-300 dark:bg-gray-600"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <UserIcon className="h-5 w-5" /> Thông tin khách hàng
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Tên khách hàng"
                                    placeholder="Nguyễn Văn A"
                                    variant="bordered"
                                    radius="lg"
                                    isRequired
                                />
                                <Input
                                    label="Số điện thoại"
                                    placeholder="0901234567"
                                    variant="bordered"
                                    radius="lg"
                                    isRequired
                                />
                            </div>
                            <Input
                                label="Email"
                                type="email"
                                placeholder="email@example.com"
                                variant="bordered"
                                radius="lg"
                            />
                            <Input
                                label="Địa chỉ giao hàng"
                                placeholder="123 Đường ABC, Quận 1, TP.HCM"
                                variant="bordered"
                                radius="lg"
                                isRequired
                            />
                            <div className="flex justify-end">
                                <Button color="primary" radius="full" onPress={() => setStep(2)}>
                                    Tiếp theo
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <ShoppingCartIcon className="h-5 w-5" /> Sản phẩm
                            </h3>
                            {orderItems.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 items-end gap-3">
                                    <div className="col-span-5">
                                        <Input
                                            label="Tên sản phẩm"
                                            value={item.name}
                                            onChange={(e) => {
                                                const arr = [...orderItems];
                                                arr[index].name = e.target.value;
                                                setOrderItems(arr);
                                            }}
                                            variant="bordered"
                                            radius="lg"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            label="SL"
                                            value={String(item.qty)}
                                            onChange={(e) => {
                                                const arr = [...orderItems];
                                                arr[index].qty = Number(e.target.value);
                                                setOrderItems(arr);
                                            }}
                                            variant="bordered"
                                            radius="lg"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <Input
                                            type="number"
                                            label="Đơn giá"
                                            value={String(item.price)}
                                            onChange={(e) => {
                                                const arr = [...orderItems];
                                                arr[index].price = Number(e.target.value);
                                                setOrderItems(arr);
                                            }}
                                            variant="bordered"
                                            radius="lg"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Button
                                            color="danger"
                                            variant="flat"
                                            size="sm"
                                            radius="full"
                                            onPress={() => removeItem(index)}
                                            isDisabled={orderItems.length === 1}
                                        >
                                            Xóa
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                variant="bordered"
                                radius="full"
                                onPress={addItem}
                                startContent={<PlusIcon className="h-4 w-4" />}
                            >
                                Thêm sản phẩm
                            </Button>
                            <Divider className="my-4" />
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Tổng cộng:</span>
                                <span className="text-green-600">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <Button variant="bordered" radius="full" onPress={() => setStep(1)}>
                                    Quay lại
                                </Button>
                                <Button color="primary" radius="full" onPress={() => setStep(3)}>
                                    Tiếp theo
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-lg font-bold">
                                <DocumentTextIcon className="h-5 w-5" /> Xác nhận đơn hàng
                            </h3>
                            <Card className="bg-gray-50 dark:bg-zinc-800">
                                <CardBody className="space-y-2 p-4">
                                    <p>
                                        <strong>Khách hàng:</strong> Nguyễn Văn A
                                    </p>
                                    <p>
                                        <strong>SĐT:</strong> 0901234567
                                    </p>
                                    <p>
                                        <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM
                                    </p>
                                    <Divider className="my-2" />
                                    <p>
                                        <strong>Số sản phẩm:</strong> {orderItems.length}
                                    </p>
                                    <p className="text-xl font-bold text-green-600">
                                        Tổng: {formatCurrency(totalAmount)}
                                    </p>
                                </CardBody>
                            </Card>
                            <div className="flex justify-between">
                                <Button variant="bordered" radius="full" onPress={() => setStep(2)}>
                                    Quay lại
                                </Button>
                                <Button color="success" radius="full">
                                    Xác nhận đặt hàng
                                </Button>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </>
    );
}

// ==================== CUSTOMERS LIST PAGE ====================

export function CustomersListPage() {
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
    } = useTableData<Customer>({ fetchFn: createFetchFn(mockCustomers), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

    const columns: TableColumn<Customer>[] = useMemo(
        () => [
            {
                key: 'customerCode',
                label: 'Mã KH',
                width: 100,
                render: (c) => <span className="font-mono text-blue-600">{c.customerCode}</span>,
            },
            {
                key: 'name',
                label: 'Khách hàng',
                render: (c) => (
                    <div className="flex items-center gap-3">
                        <Avatar name={c.name} size="sm" />
                        <div>
                            <p className="font-medium">{c.name}</p>
                            <p className="text-xs text-gray-500">{c.company}</p>
                        </div>
                    </div>
                ),
            },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'SĐT' },
            { key: 'totalOrders', label: 'Đơn hàng', width: 80 },
            {
                key: 'totalSpent',
                label: 'Chi tiêu',
                render: (c) => (
                    <span className="font-semibold text-green-600">
                        {formatCurrency(c.totalSpent)}
                    </span>
                ),
            },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (c) => (
                    <Chip
                        size="sm"
                        color={c.status === 'active' ? 'success' : 'danger'}
                        variant="flat"
                    >
                        {c.status === 'active' ? 'Hoạt động' : 'Ngừng'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<Customer>[] = useMemo(
        () => [
            {
                key: 'edit',
                label: t('common.edit'),
                onClick: (c) => {
                    setSelectedCustomer(c);
                    setModalMode('edit');
                    setIsModalOpen(true);
                },
            },
            {
                key: 'delete',
                label: t('common.delete'),
                onClick: (c) => {
                    setSelectedCustomer(c);
                    setIsDeleteOpen(true);
                },
            },
        ],
        [t]
    );

    return (
        <>
            <PageHeader
                title={t('menu.customerList')}
                breadcrumbs={[{ label: t('menu.group.sales') }, { label: t('menu.customers') }]}
                actions={
                    <Button
                        color="primary"
                        as="a"
                        href="/sales/customers/new"
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Thêm khách hàng
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(c) => c.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm khách hàng..."
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
                title={modalMode === 'create' ? 'Thêm khách hàng' : 'Sửa khách hàng'}
            >
                <div className="flex flex-col gap-4">
                    <Input
                        label="Tên khách hàng"
                        placeholder="Nguyễn Văn A"
                        defaultValue={selectedCustomer?.name}
                        variant="bordered"
                        radius="lg"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            defaultValue={selectedCustomer?.email}
                            variant="bordered"
                            radius="lg"
                        />
                        <Input
                            label="SĐT"
                            placeholder="0901234567"
                            defaultValue={selectedCustomer?.phone}
                            variant="bordered"
                            radius="lg"
                        />
                    </div>
                    <Input
                        label="Công ty"
                        placeholder="Tên công ty"
                        defaultValue={selectedCustomer?.company}
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Địa chỉ"
                        placeholder="Địa chỉ đầy đủ"
                        defaultValue={selectedCustomer?.address}
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
            <ConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={() => {
                    setIsDeleteOpen(false);
                    refresh();
                }}
                title="Xóa khách hàng"
                message={`Bạn có chắc muốn xóa khách hàng ${selectedCustomer?.name}?`}
            />
        </>
    );
}

// ==================== ADD CUSTOMER PAGE ====================

export function AddCustomerPage() {
    const { t } = useTranslation();

    return (
        <>
            <PageHeader
                title={t('menu.addCustomer')}
                breadcrumbs={[
                    { label: t('menu.group.sales') },
                    { label: t('menu.customers') },
                    { label: 'Thêm mới' },
                ]}
            />
            <Card className="mx-auto max-w-2xl">
                <CardBody className="space-y-4 p-6">
                    <h3 className="text-lg font-bold">Thông tin khách hàng</h3>
                    <Input
                        label="Tên khách hàng"
                        placeholder="Nguyễn Văn A"
                        variant="bordered"
                        radius="lg"
                        isRequired
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            variant="bordered"
                            radius="lg"
                        />
                        <Input
                            label="Số điện thoại"
                            placeholder="0901234567"
                            variant="bordered"
                            radius="lg"
                            isRequired
                        />
                    </div>
                    <Input
                        label="Công ty"
                        placeholder="Tên công ty (nếu có)"
                        variant="bordered"
                        radius="lg"
                    />
                    <Input
                        label="Địa chỉ"
                        placeholder="Địa chỉ đầy đủ"
                        variant="bordered"
                        radius="lg"
                    />
                    <Select label="Nguồn khách hàng" variant="bordered" radius="lg">
                        <SelectItem key="website">Website</SelectItem>
                        <SelectItem key="referral">Giới thiệu</SelectItem>
                        <SelectItem key="ads">Quảng cáo</SelectItem>
                        <SelectItem key="social">Mạng xã hội</SelectItem>
                        <SelectItem key="other">Khác</SelectItem>
                    </Select>
                    <Divider />
                    <div className="flex justify-end gap-3">
                        <Button variant="bordered" radius="full" as="a" href="/sales/customers">
                            Hủy
                        </Button>
                        <Button color="primary" radius="full">
                            Lưu khách hàng
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

// ==================== SALES QUOTES PAGE ====================

export function SalesQuotesPage() {
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
    } = useTableData<SalesQuote>({ fetchFn: createFetchFn(mockQuotes), initialPageSize: 10 });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted':
                return 'success';
            case 'rejected':
                return 'danger';
            case 'expired':
                return 'default';
            case 'sent':
                return 'primary';
            default:
                return 'warning';
        }
    };

    const columns: TableColumn<SalesQuote>[] = useMemo(
        () => [
            {
                key: 'quoteCode',
                label: 'Mã báo giá',
                width: 110,
                render: (q) => <span className="font-mono text-blue-600">{q.quoteCode}</span>,
            },
            { key: 'customerName', label: 'Khách hàng' },
            { key: 'items', label: 'SP', width: 60 },
            { key: 'subtotal', label: 'Tạm tính', render: (q) => formatCurrency(q.subtotal) },
            {
                key: 'discount',
                label: 'Giảm giá',
                render: (q) =>
                    q.discount > 0 ? (
                        <span className="text-red-500">-{formatCurrency(q.discount)}</span>
                    ) : (
                        '-'
                    ),
            },
            {
                key: 'total',
                label: 'Tổng',
                render: (q) => <span className="font-bold">{formatCurrency(q.total)}</span>,
            },
            { key: 'validUntil', label: 'Hiệu lực đến' },
            {
                key: 'status',
                label: 'Trạng thái',
                render: (q) => (
                    <Chip size="sm" color={getStatusColor(q.status)} variant="flat">
                        {q.status === 'draft'
                            ? 'Nháp'
                            : q.status === 'sent'
                              ? 'Đã gửi'
                              : q.status === 'accepted'
                                ? 'Chấp nhận'
                                : q.status === 'rejected'
                                  ? 'Từ chối'
                                  : 'Hết hạn'}
                    </Chip>
                ),
            },
        ],
        []
    );

    const actions: TableAction<SalesQuote>[] = useMemo(
        () => [
            { key: 'view', label: 'Xem', onClick: () => {} },
            {
                key: 'send',
                label: 'Gửi',
                onClick: () => refresh(),
                isVisible: (q) => q.status === 'draft',
            },
            {
                key: 'convert',
                label: 'Tạo đơn',
                onClick: () => {},
                isVisible: (q) => q.status === 'accepted',
            },
        ],
        [refresh]
    );

    return (
        <>
            <PageHeader
                title={t('menu.salesQuotes')}
                breadcrumbs={[{ label: t('menu.group.sales') }, { label: 'Báo giá' }]}
                actions={
                    <Button
                        color="primary"
                        onPress={() => setIsModalOpen(true)}
                        startContent={<PlusIcon className="h-4 w-4" />}
                        radius="full"
                    >
                        Tạo báo giá
                    </Button>
                }
            />
            <Table
                items={items}
                columns={columns}
                getRowKey={(q) => q.id}
                actions={actions}
                isLoading={isLoading}
                showSearch
                searchPlaceholder="Tìm báo giá..."
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
                title="Tạo báo giá mới"
            >
                <div className="flex flex-col gap-4">
                    <Select
                        label="Khách hàng"
                        placeholder="Chọn khách hàng"
                        variant="bordered"
                        radius="lg"
                    >
                        {mockCustomers.slice(0, 10).map((c) => (
                            <SelectItem key={c.id}>{c.name}</SelectItem>
                        ))}
                    </Select>
                    <Input type="date" label="Hiệu lực đến" variant="bordered" radius="lg" />
                    <Input
                        type="number"
                        label="Giảm giá (%)"
                        placeholder="0"
                        variant="bordered"
                        radius="lg"
                    />
                </div>
            </CommonModal>
        </>
    );
}
