'use client';

import { useState, useMemo, useCallback, useEffect, type ChangeEvent } from 'react';
import Image from 'next/image';
import {
    Card,
    Button,
    Table,
    Chip,
    Input,
    Modal,
    Select,
    SelectItem,
} from '@/components/common';
import {
    DocumentTextIcon,
    QrCodeIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    ClockIcon,
    PlusIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { FinanceService } from '@/services/finance.service';
import type { InvoiceItem, BankItem } from '@/types';

export function FinanceInvoices() {
    const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [banks, setBanks] = useState<BankItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Form thêm hóa đơn
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerTaxCode, setNewCustomerTaxCode] = useState('');
    const [newAmount, setNewAmount] = useState<number>(0);
    const [newDueDate, setNewDueDate] = useState('');
    const [newBankBin, setNewBankBin] = useState('970407');
    const [newAccountNumber, setNewAccountNumber] = useState('19036789999011');

    const loadInvoices = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await FinanceService.getInvoices({
                keyword: searchTerm,
                status: selectedStatus as 'all' | 'paid' | 'pending' | 'overdue',
            });
            if (res.data?.items) {
                setInvoices(res.data.items);
            }
        } catch {
            // Error handling
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, selectedStatus]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const res = await FinanceService.getBanks();
                if (res.data && Array.isArray(res.data)) {
                    setBanks(res.data);
                }
            } catch {
                // Keep default if fail
            }
        };
        fetchBanks();
    }, []);

    // Lọc hóa đơn
    const filteredInvoices = invoices;

    // Thống kê nhanh
    const stats = useMemo(() => {
        const totalAmount = invoices.reduce((acc, curr) => acc + curr.amount, 0);
        const paidAmount = invoices
            .filter((i) => i.status === 'paid')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const pendingAmount = invoices
            .filter((i) => i.status === 'pending')
            .reduce((acc, curr) => acc + curr.amount, 0);
        const overdueAmount = invoices
            .filter((i) => i.status === 'overdue')
            .reduce((acc, curr) => acc + curr.amount, 0);
        return { totalAmount, paidAmount, pendingAmount, overdueAmount };
    }, [invoices]);

    const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleOpenVietQR = (inv: InvoiceItem) => {
        setSelectedInvoice(inv);
        setIsQrModalOpen(true);
    };

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCustomerName || newAmount <= 0) return;
        const selectedBank = banks.find((b) => b.bin === newBankBin) || banks[0];
        await FinanceService.createInvoice({
            customerName: newCustomerName,
            customerTaxCode: newCustomerTaxCode || '0310000000',
            amount: newAmount,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: newDueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
            bankBin: newBankBin,
            bankName: selectedBank?.shortName || 'Ngân hàng',
            accountNumber: newAccountNumber,
        });
        setIsCreateModalOpen(false);
        loadInvoices();
    };

    // Tạo link VietQR API (J2Team/VietQR Gateway) kèm tiền tố DEMO bắt buộc
    const qrUrl = selectedInvoice
        ? FinanceService.generateDemoQrUrl(
              selectedInvoice.bankBin,
              selectedInvoice.accountNumber,
              selectedInvoice.amount,
              `DEMO-${selectedInvoice.invoiceNumber}`
          )
        : '';

    return (
        <div className="space-y-6">
            {/* Header & Tiêu đề */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Hóa đơn & Thanh toán VietQR
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quản lý hóa đơn doanh nghiệp, theo dõi công nợ khách hàng và tạo mã VietQR chuẩn ngân hàng.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={loadInvoices}
                        isLoading={isLoading}
                        className="flex items-center gap-1.5"
                    >
                        <ArrowPathIcon className="h-4 w-4" />
                        <span>Làm mới</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Tạo hóa đơn mới</span>
                    </Button>
                </div>
            </div>



            {/* 4 Thẻ thống kê tài chính */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        Tổng doanh số xuất hóa đơn
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 tabular-nums dark:text-white">
                        {formatVND(stats.totalAmount)}
                    </p>
                    <p className="mt-2 text-xs text-gray-500 tabular-nums">
                        {invoices.length} hóa đơn trong kỳ
                    </p>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                        Đã thanh toán (Thực thu)
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {formatVND(stats.paidAmount)}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Dòng tiền an toàn</span>
                    </div>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                        Chờ thanh toán (Trong hạn)
                    </p>
                    <p className="mt-1 text-2xl font-bold text-amber-600 tabular-nums dark:text-amber-400">
                        {formatVND(stats.pendingAmount)}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
                        <ClockIcon className="h-4 w-4" />
                        <span>Khách hàng đang đối soát</span>
                    </div>
                </Card>

                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                        Công nợ quá hạn
                    </p>
                    <p className="mt-1 text-2xl font-bold text-rose-600 tabular-nums dark:text-rose-400">
                        {formatVND(stats.overdueAmount)}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-600">
                        <ExclamationTriangleIcon className="h-4 w-4" />
                        <span>Cần gửi công văn nhắc nợ</span>
                    </div>
                </Card>
            </div>

            {/* Bộ lọc tìm kiếm */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Tìm mã HĐ, tên khách hàng, MST..."
                            value={searchTerm}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Trạng thái:
                        </span>
                        <div className="w-44">
                            <Select
                                placeholder="Chọn trạng thái"
                                selectedKey={selectedStatus}
                                onSelectionChange={(key) => {
                                    if (key) setSelectedStatus(String(key));
                                }}
                            >
                                <SelectItem id="all" textValue="Tất cả trạng thái">
                                    Tất cả trạng thái
                                </SelectItem>
                                <SelectItem id="paid" textValue="Đã thanh toán">
                                    Đã thanh toán
                                </SelectItem>
                                <SelectItem id="pending" textValue="Chờ thanh toán">
                                    Chờ thanh toán
                                </SelectItem>
                                <SelectItem id="overdue" textValue="Quá hạn">
                                    Quá hạn
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Bảng dữ liệu Hóa đơn */}
            <Card className="overflow-hidden p-0">
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Bảng danh sách hóa đơn">
                            <Table.Header>
                                <Table.Column isRowHeader className="text-left">
                                    Mã hóa đơn
                                </Table.Column>
                                <Table.Column className="text-left">Khách hàng & MST</Table.Column>
                                <Table.Column className="text-right">Số tiền</Table.Column>
                                <Table.Column className="text-center">
                                    Ngày phát hành / Hạn
                                </Table.Column>
                                <Table.Column className="text-center">Trạng thái</Table.Column>
                                <Table.Column className="text-right">Mã VietQR</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {filteredInvoices.map((inv) => (
                                    <Table.Row
                                        key={inv.id}
                                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                    >
                                        <Table.Cell className="text-left">
                                            <div className="flex items-center gap-2">
                                                <DocumentTextIcon className="h-4 w-4 flex-shrink-0 text-blue-600" />
                                                <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                                                    {inv.invoiceNumber}
                                                </span>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="text-left">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                                    {inv.customerName}
                                                </p>
                                                <p className="text-[11px] text-gray-400">
                                                    MST: {inv.customerTaxCode}
                                                </p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="text-right">
                                            <span className="font-mono text-xs font-bold text-gray-900 tabular-nums dark:text-white">
                                                {formatVND(inv.amount)}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="text-center">
                                            <div className="text-xs">
                                                <p className="text-gray-700 tabular-nums dark:text-gray-300">
                                                    Phát hành: {inv.issueDate}
                                                </p>
                                                <p className="text-gray-400 tabular-nums">
                                                    Hạn chót: {inv.dueDate}
                                                </p>
                                            </div>
                                        </Table.Cell>
                                        <Table.Cell className="text-center">
                                            {inv.status === 'paid' && (
                                                <Chip color="success" variant="soft" size="sm">
                                                    Đã thanh toán
                                                </Chip>
                                            )}
                                            {inv.status === 'pending' && (
                                                <Chip color="warning" variant="soft" size="sm">
                                                    Chờ thanh toán
                                                </Chip>
                                            )}
                                            {inv.status === 'overdue' && (
                                                <Chip color="danger" variant="soft" size="sm">
                                                    Quá hạn
                                                </Chip>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell className="text-right">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleOpenVietQR(inv)}
                                                className="inline-flex items-center gap-1.5"
                                            >
                                                <QrCodeIcon className="h-4 w-4 text-indigo-600" />
                                                <span>Mã VietQR</span>
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card>

            {/* Modal VietQR Thanh toán */}
            <Modal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                title="Mã thanh toán VietQR"
                size="md"
            >
                {selectedInvoice && (
                    <div className="space-y-4 text-center">
                        {/* Khung chứa ảnh QR */}
                        <div className="relative mx-auto w-64 rounded-2xl border border-gray-200 bg-white p-4 shadow-md dark:border-zinc-700">

                            <div className="relative h-56 w-full">
                                <Image
                                    src={qrUrl}
                                    alt="Mã thanh toán VietQR"
                                    fill
                                    unoptimized
                                    className="object-contain"
                                />
                            </div>

                            <div className="mt-3 border-t border-gray-100 pt-2 text-xs text-gray-500 dark:border-zinc-700">
                                Ngân hàng:{' '}
                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                    {selectedInvoice.bankName}
                                </span>
                            </div>
                        </div>

                        {/* Chi tiết nội dung thanh toán */}
                        <div className="space-y-1.5 rounded-xl bg-gray-50 p-4 text-left text-xs dark:bg-zinc-800/60">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Hóa đơn:</span>
                                <span className="font-mono font-bold text-gray-900 dark:text-white">
                                    {selectedInvoice.invoiceNumber}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Khách hàng:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {selectedInvoice.customerName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Số tiền thanh toán:</span>
                                <span className="font-mono font-bold text-emerald-600">
                                    {formatVND(selectedInvoice.amount)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Nội dung chuyển:</span>
                                <span className="font-mono font-semibold text-blue-600">
                                    {selectedInvoice.invoiceNumber}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center pt-2">
                            <Button variant="secondary" onClick={() => setIsQrModalOpen(false)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Modal Tạo Hóa Đơn Mới */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Tạo hóa đơn bán hàng mới"
            >
                <form onSubmit={handleCreateInvoice} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Tên doanh nghiệp khách hàng:
                        </label>
                        <Input
                            placeholder="Ví dụ: Công ty TNHH Phát triển Á Châu"
                            value={newCustomerName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewCustomerName(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Mã số thuế (MST):
                            </label>
                            <Input
                                placeholder="0310xxxxxx"
                                value={newCustomerTaxCode}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setNewCustomerTaxCode(e.target.value)
                                }
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Số tiền thanh toán (VND):
                            </label>
                            <Input
                                type="number"
                                placeholder="25000000"
                                value={newAmount ? String(newAmount) : ''}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setNewAmount(Number(e.target.value) || 0)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Hạn thanh toán:
                            </label>
                            <Input
                                type="date"
                                value={newDueDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setNewDueDate(e.target.value)
                                }
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Số tài khoản thụ hưởng:
                            </label>
                            <Input
                                placeholder="19036789999011"
                                value={newAccountNumber}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setNewAccountNumber(e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Ngân hàng thụ hưởng:
                        </label>
                        <Select
                            placeholder="Chọn ngân hàng thụ hưởng"
                            selectedKey={newBankBin}
                            onSelectionChange={(key) => {
                                if (key) setNewBankBin(String(key));
                            }}
                        >
                            {banks.map((b) => (
                                <SelectItem
                                    key={b.bin}
                                    id={b.bin}
                                    textValue={`${b.shortName} - ${b.name}`}
                                >
                                    {b.shortName} - {b.name}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Hủy bỏ
                        </Button>
                        <Button variant="primary" type="submit">
                            Lưu và phát hành hóa đơn
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
