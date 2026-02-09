import { FetchParams, PagedResult } from '@/components/common';

// ==================== TYPES ====================

export interface StockItem {
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

export interface Warehouse {
    id: number;
    code: string;
    name: string;
    address: string;
    manager: string;
    capacity: number;
    used: number;
    status: 'active' | 'inactive';
}

export interface StockTransfer {
    id: number;
    transferCode: string;
    fromWarehouse: string;
    toWarehouse: string;
    items: number;
    status: 'pending' | 'intransit' | 'completed' | 'cancelled';
    requestDate: string;
    completedDate: string | null;
}

export interface PurchaseOrder {
    id: number;
    poCode: string;
    supplier: string;
    items: number;
    total: number;
    status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
    orderDate: string;
    expectedDate: string;
}

export interface Supplier {
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

export interface GoodsReceipt {
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

export const mockStock: StockItem[] = Array.from({ length: 50 }, (_, i) => ({
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

export const mockWarehouses: Warehouse[] = [
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

export const mockTransfers: StockTransfer[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    transferCode: `TF${String(i + 1).padStart(4, '0')}`,
    fromWarehouse: mockWarehouses[i % 3].name,
    toWarehouse: mockWarehouses[(i + 1) % 3].name,
    items: (i % 5) + 1,
    status: (['pending', 'intransit', 'completed', 'cancelled'] as const)[i % 4],
    requestDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    completedDate: i % 4 === 2 ? new Date(2024, 0, i + 3).toISOString().split('T')[0] : null,
}));

export const mockPOs: PurchaseOrder[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    poCode: `PO${String(i + 1).padStart(5, '0')}`,
    supplier: `Nhà cung cấp ${(i % 10) + 1}`,
    items: (i % 8) + 1,
    total: (i + 1) * 1000000 + 5000000,
    status: (['draft', 'sent', 'confirmed', 'received', 'cancelled'] as const)[i % 5],
    orderDate: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    expectedDate: new Date(2024, 0, i + 7).toISOString().split('T')[0],
}));

export const mockSuppliers: Supplier[] = Array.from({ length: 15 }, (_, i) => ({
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

export const mockReceipts: GoodsReceipt[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    receiptCode: `GR${String(i + 1).padStart(4, '0')}`,
    poCode: mockPOs[i % 10].poCode,
    supplier: mockPOs[i % 10].supplier,
    items: (i % 5) + 1,
    warehouse: mockWarehouses[i % 3].name,
    status: (['pending', 'inspecting', 'completed', 'rejected'] as const)[i % 4],
    receivedDate: new Date(2024, 0, i + 5).toISOString().split('T')[0],
}));

// ==================== HELPERS ====================

export const createFetchFn =
    <T>(data: T[]) =>
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

export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
