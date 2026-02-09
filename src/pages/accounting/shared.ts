import { FetchParams, PagedResult } from '@/components/common';

// ==================== TYPES ====================

export interface Account {
    id: number;
    code: string;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
    parentCode: string | null;
    balance: number;
    status: 'active' | 'inactive';
}

export interface JournalEntry {
    id: number;
    entryNumber: string;
    date: string;
    description: string;
    debitAccount: string;
    creditAccount: string;
    amount: number;
    status: 'draft' | 'posted' | 'reversed';
    createdBy: string;
    createdAt: string;
}

// ==================== MOCK DATA ====================

export const mockAccounts: Account[] = [
    // Assets
    {
        id: 1,
        code: '111',
        name: 'Tiền mặt',
        type: 'asset',
        parentCode: null,
        balance: 500000000,
        status: 'active',
    },
    {
        id: 2,
        code: '112',
        name: 'Tiền gửi ngân hàng',
        type: 'asset',
        parentCode: null,
        balance: 2500000000,
        status: 'active',
    },
    {
        id: 3,
        code: '131',
        name: 'Phải thu khách hàng',
        type: 'asset',
        parentCode: null,
        balance: 800000000,
        status: 'active',
    },
    {
        id: 4,
        code: '152',
        name: 'Nguyên vật liệu',
        type: 'asset',
        parentCode: null,
        balance: 300000000,
        status: 'active',
    },
    {
        id: 5,
        code: '211',
        name: 'Tài sản cố định hữu hình',
        type: 'asset',
        parentCode: null,
        balance: 1500000000,
        status: 'active',
    },
    // Liabilities
    {
        id: 6,
        code: '331',
        name: 'Phải trả người bán',
        type: 'liability',
        parentCode: null,
        balance: 450000000,
        status: 'active',
    },
    {
        id: 7,
        code: '334',
        name: 'Phải trả người lao động',
        type: 'liability',
        parentCode: null,
        balance: 200000000,
        status: 'active',
    },
    {
        id: 8,
        code: '341',
        name: 'Vay và nợ thuê tài chính',
        type: 'liability',
        parentCode: null,
        balance: 1000000000,
        status: 'active',
    },
    // Equity
    {
        id: 9,
        code: '411',
        name: 'Vốn đầu tư của chủ sở hữu',
        type: 'equity',
        parentCode: null,
        balance: 3000000000,
        status: 'active',
    },
    {
        id: 10,
        code: '421',
        name: 'Lợi nhuận chưa phân phối',
        type: 'equity',
        parentCode: null,
        balance: 500000000,
        status: 'active',
    },
    // Revenue
    {
        id: 11,
        code: '511',
        name: 'Doanh thu bán hàng',
        type: 'revenue',
        parentCode: null,
        balance: 5000000000,
        status: 'active',
    },
    {
        id: 12,
        code: '515',
        name: 'Doanh thu hoạt động tài chính',
        type: 'revenue',
        parentCode: null,
        balance: 100000000,
        status: 'active',
    },
    // Expense
    {
        id: 13,
        code: '632',
        name: 'Giá vốn hàng bán',
        type: 'expense',
        parentCode: null,
        balance: 3500000000,
        status: 'active',
    },
    {
        id: 14,
        code: '641',
        name: 'Chi phí bán hàng',
        type: 'expense',
        parentCode: null,
        balance: 300000000,
        status: 'active',
    },
    {
        id: 15,
        code: '642',
        name: 'Chi phí quản lý doanh nghiệp',
        type: 'expense',
        parentCode: null,
        balance: 400000000,
        status: 'active',
    },
];

export const mockJournals: JournalEntry[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    entryNumber: `JE${String(i + 1).padStart(5, '0')}`,
    date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
    description: [
        'Thu tiền khách hàng',
        'Chi trả nhà cung cấp',
        'Ghi nhận doanh thu',
        'Chi phí lương',
        'Khấu hao TSCĐ',
    ][i % 5],
    debitAccount: mockAccounts[(i * 2) % 15].code + ' - ' + mockAccounts[(i * 2) % 15].name,
    creditAccount:
        mockAccounts[(i * 2 + 1) % 15].code + ' - ' + mockAccounts[(i * 2 + 1) % 15].name,
    amount: (i + 1) * 5000000,
    status: (['draft', 'posted', 'reversed'] as const)[i % 3],
    createdBy: `Kế toán ${(i % 3) + 1}`,
    createdAt: new Date(2024, 0, i + 1).toISOString(),
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
