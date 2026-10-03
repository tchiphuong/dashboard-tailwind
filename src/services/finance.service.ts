import { apiClient } from '@/lib/api-client';
import type {
    InvoiceItem,
    InvoiceListParams,
    CreateInvoiceDto,
    DepartmentBudget,
    ApiResponse,
    PagedResponse,
    PagedResult,
    BankItem,
} from '@/types';

// Dữ liệu mẫu mock an toàn tuân thủ quy tắc ZERO-BUG & AN TOÀN TIỀN TỆ
const INITIAL_INVOICES: InvoiceItem[] = [
    {
        id: 'INV-1',
        invoiceNumber: 'HD-2026-0891',
        customerName: 'Công ty Cổ phần Công nghệ Sao Mai',
        customerTaxCode: '0312456789',
        amount: 45000000,
        issueDate: '2026-09-15',
        dueDate: '2026-09-30',
        status: 'pending',
        accountNumber: '19036789999011',
        bankBin: '970407',
        bankName: 'Techcombank',
    },
    {
        id: 'INV-2',
        invoiceNumber: 'HD-2026-0890',
        customerName: 'Tập đoàn Bán lẻ Phương Nam',
        customerTaxCode: '0109876543',
        amount: 128500000,
        issueDate: '2026-09-10',
        dueDate: '2026-09-25',
        status: 'paid',
        accountNumber: '1029384756',
        bankBin: '970436',
        bankName: 'Vietcombank',
    },
    {
        id: 'INV-3',
        invoiceNumber: 'HD-2026-0889',
        customerName: 'Doanh nghiệp Tư nhân Vận tải Hoàng Long',
        customerTaxCode: '3601234567',
        amount: 32000000,
        issueDate: '2026-09-01',
        dueDate: '2026-09-15',
        status: 'overdue',
        accountNumber: '0381000456789',
        bankBin: '970415',
        bankName: 'VietinBank',
    },
    {
        id: 'INV-4',
        invoiceNumber: 'HD-2026-0888',
        customerName: 'Chuỗi Nhà hàng Hải sản Cửu Long',
        customerTaxCode: '1802345678',
        amount: 76200000,
        issueDate: '2026-09-18',
        dueDate: '2026-10-02',
        status: 'pending',
        accountNumber: '6868999988',
        bankBin: '970422',
        bankName: 'MBBank',
    },
    {
        id: 'INV-5',
        invoiceNumber: 'HD-2026-0887',
        customerName: 'Công ty TNHH May mặc An Phú',
        customerTaxCode: '0315998877',
        amount: 95000000,
        issueDate: '2026-08-20',
        dueDate: '2026-09-05',
        status: 'paid',
        accountNumber: '110600123456',
        bankBin: '970418',
        bankName: 'BIDV',
    },
];

const INITIAL_BUDGETS: DepartmentBudget[] = [
    { id: 'dep-1', department: 'Công nghệ & Phát triển Phần mềm', allocated: 2500000000, spent: 1750000000, manager: 'Nguyễn Văn A' },
    { id: 'dep-2', department: 'Tiếp thị & Truyền thông (Marketing)', allocated: 1200000000, spent: 980000000, manager: 'Trần Thị B' },
    { id: 'dep-3', department: 'Kinh doanh & Phát triển Thị trường', allocated: 1800000000, spent: 1120000000, manager: 'Lê Hoàng C' },
    { id: 'dep-4', department: 'Vận hành & Cơ sở Hạ tầng IT', allocated: 900000000, spent: 630000000, manager: 'Phạm Minh D' },
    { id: 'dep-5', department: 'Nhân sự & Đào tạo', allocated: 600000000, spent: 340000000, manager: 'Võ Thị E' },
];

let inMemoryInvoices = [...INITIAL_INVOICES];

export const FinanceService = {
    /**
     * Lấy danh sách hóa đơn theo trạng thái và tìm kiếm
     */
    async getInvoices(params?: InvoiceListParams): Promise<PagedResponse<InvoiceItem>> {
        try {
            return await apiClient.get<PagedResult<InvoiceItem>>('/api/v1/finance/invoices', { params });
        } catch {
            // Fallback an toàn với mock data
            let filtered = [...inMemoryInvoices];
            if (params?.status && params.status !== 'all') {
                filtered = filtered.filter((i) => i.status === params.status);
            }
            if (params?.keyword) {
                const kw = params.keyword.toLowerCase();
                filtered = filtered.filter(
                    (i) =>
                        i.customerName.toLowerCase().includes(kw) ||
                        i.invoiceNumber.toLowerCase().includes(kw)
                );
            }
            return {
                returnCode: 0,
                message: 'Success',
                errors: [],
                data: {
                    items: filtered,
                    paging: {
                        pageIndex: 1,
                        pageSize: filtered.length,
                        totalItems: filtered.length,
                        totalPages: 1,
                    },
                },
            };
        }
    },

    /**
     * Tạo mới hóa đơn (Demo Only)
     */
    async createInvoice(data: CreateInvoiceDto): Promise<ApiResponse<InvoiceItem>> {
        const newInvoice: InvoiceItem = {
            id: `INV-${Date.now()}`,
            invoiceNumber: `HD-2026-${Date.now().toString().slice(-4)}`,
            ...data,
            status: 'pending',
        };
        inMemoryInvoices = [newInvoice, ...inMemoryInvoices];
        return {
            returnCode: 0,
            message: 'Tạo hóa đơn thành công (DEMO ONLY)',
            errors: [],
            data: newInvoice,
        };
    },

    /**
     * Cập nhật trạng thái hóa đơn
     */
    async updateInvoiceStatus(
        id: string,
        status: 'paid' | 'pending' | 'overdue'
    ): Promise<ApiResponse<InvoiceItem | null>> {
        const index = inMemoryInvoices.findIndex((i) => i.id === id);
        if (index >= 0) {
            inMemoryInvoices[index] = { ...inMemoryInvoices[index], status };
            return {
                returnCode: 0,
                message: 'Cập nhật trạng thái thành công',
                errors: [],
                data: inMemoryInvoices[index],
            };
        }
        return {
            returnCode: -1,
            message: 'Không tìm thấy hóa đơn',
            errors: ['Invoice not found'],
            data: null,
        };
    },

    /**
     * Lấy danh sách ngân sách phòng ban
     */
    async getDepartmentBudgets(): Promise<ApiResponse<DepartmentBudget[]>> {
        return {
            returnCode: 0,
            message: 'Success',
            errors: [],
            data: INITIAL_BUDGETS,
        };
    },

    /**
     * Lấy danh sách 65+ ngân hàng Việt Nam từ VietQR Open API
     */
    async getBanks(): Promise<ApiResponse<BankItem[]>> {
        return apiClient.get<BankItem[]>('/api/v1/utilities/banks');
    },

    /**
     * Sinh link mã VietQR Demo chuẩn theo quy tắc AN TOÀN TIỀN TỆ
     */
    generateDemoQrUrl(bankBin: string, accountNumber: string, amount: number, memo: string): string {
        const safeMemo = memo.startsWith('DEMO-') ? memo : `DEMO-${memo}`;
        return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(safeMemo)}`;
    },
};
