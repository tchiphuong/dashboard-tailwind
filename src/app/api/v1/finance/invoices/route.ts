import { NextRequest } from "next/server";
import { pagedSuccessResponse, successResponse, errorResponse } from "@/lib/api-response-helper";
import type { InvoiceItem, CreateInvoiceDto } from "@/types";

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

let inMemoryInvoices: InvoiceItem[] = [...INITIAL_INVOICES];

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const pageIndex = Math.max(1, Number(searchParams.get("pageIndex")) || 1);
    const pageSize = Math.max(1, Number(searchParams.get("pageSize")) || 20);
    const statusFilter = searchParams.get("status");
    const keyword = searchParams.get("keyword")?.toLowerCase();

    let filtered = [...inMemoryInvoices];

    if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter((i) => i.status === statusFilter);
    }
    if (keyword) {
        filtered = filtered.filter(
            (i) =>
                i.customerName.toLowerCase().includes(keyword) ||
                i.invoiceNumber.toLowerCase().includes(keyword) ||
                i.customerTaxCode.toLowerCase().includes(keyword)
        );
    }

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    const paginatedItems = filtered.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);

    return pagedSuccessResponse<InvoiceItem>(paginatedItems, {
        pageIndex,
        pageSize,
        totalItems,
        totalPages,
    });
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateInvoiceDto = await req.json();

        if (!body.customerName || !body.amount) {
            return errorResponse("Vui lòng điền đầy đủ tên khách hàng và số tiền", 400);
        }

        const newInvoice: InvoiceItem = {
            id: `INV-${Date.now()}`,
            invoiceNumber: `HD-2026-${Date.now().toString().slice(-4)}`,
            customerName: body.customerName,
            customerTaxCode: body.customerTaxCode || '0310000000',
            amount: Number(body.amount) || 0,
            issueDate: body.issueDate || new Date().toISOString().split('T')[0],
            dueDate: body.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            status: 'pending',
            bankBin: body.bankBin,
            bankName: body.bankName,
            accountNumber: body.accountNumber,
        };

        inMemoryInvoices = [newInvoice, ...inMemoryInvoices];

        return successResponse(newInvoice, "Tạo hóa đơn thành công", 201);
    } catch {
        return errorResponse("Dữ liệu đầu vào không hợp lệ", 400);
    }
}
