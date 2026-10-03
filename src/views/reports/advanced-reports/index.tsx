'use client';

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, Button, Table, Chip, ProgressBar, Modal, Input, Alert } from '@/components/common';
import {
    ChartBarIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    UsersIcon,
    SparklesIcon,
} from '@heroicons/react/24/outline';

interface ChannelReport {
    id: string;
    channel: string;
    target: number;
    actual: number;
    growth: number; // %
    ordersCount: number;
    status: 'exceeded' | 'on_track' | 'lagging';
}

const CHANNELS_DATA: ChannelReport[] = [
    {
        id: 'CH-1',
        channel: 'Kênh Thương mại điện tử (Web / App)',
        target: 850000000,
        actual: 920000000,
        growth: 12.8,
        ordersCount: 3410,
        status: 'exceeded',
    },
    {
        id: 'CH-2',
        channel: 'Kênh B2B Doanh nghiệp & Dự án',
        target: 1200000000,
        actual: 1150000000,
        growth: 6.4,
        ordersCount: 142,
        status: 'on_track',
    },
    {
        id: 'CH-3',
        channel: 'Hệ thống Chuỗi Đại lý phân phối',
        target: 650000000,
        actual: 580000000,
        growth: -4.2,
        ordersCount: 890,
        status: 'lagging',
    },
    {
        id: 'CH-4',
        channel: 'Kênh Bán hàng Mạng xã hội & Livestream',
        target: 400000000,
        actual: 485000000,
        growth: 21.5,
        ordersCount: 2150,
        status: 'exceeded',
    },
    {
        id: 'CH-5',
        channel: 'Xuất khẩu Ủy thác nước ngoài',
        target: 900000000,
        actual: 890000000,
        growth: 1.1,
        ordersCount: 38,
        status: 'on_track',
    },
];

export function AdvancedReportsPage() {
    const t = useTranslations();
    const [period, setPeriod] = useState<string>('q3_2026');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [exportFormat, setExportFormat] = useState('excel');
    const [reportTitle, setReportTitle] = useState('Báo cáo phân tích kinh doanh đa kênh');
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    // Tính toán tổng số liệu
    const summary = useMemo(() => {
        const totalTarget = CHANNELS_DATA.reduce((acc, curr) => acc + curr.target, 0);
        const totalActual = CHANNELS_DATA.reduce((acc, curr) => acc + curr.actual, 0);
        const totalOrders = CHANNELS_DATA.reduce((acc, curr) => acc + curr.ordersCount, 0);
        const completionRate = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0;
        const avgOrderValue = totalOrders > 0 ? Math.round(totalActual / totalOrders) : 0;
        return { totalTarget, totalActual, totalOrders, completionRate, avgOrderValue };
    }, []);

    const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleExport = (e: React.FormEvent) => {
        e.preventDefault();
        setIsExporting(true);

        setTimeout(() => {
            setIsExporting(false);
            setIsExportModalOpen(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 4000);
        }, 800);
    };

    return (
        <div className="space-y-6">
            {/* Tiêu đề & Lựa chọn thời gian */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t('menu.advancedReports')}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phân tích chuyên sâu doanh số đa kênh, hiệu suất kinh doanh và xuất báo cáo
                        quản trị tổng hợp.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200">
                        <CalendarIcon className="h-4 w-4 text-gray-500" />
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-transparent font-medium focus:outline-none"
                        >
                            <option value="month">Tháng hiện tại (Tháng 9/2026)</option>
                            <option value="q3_2026">Quý 3 / 2026 (Hiện tại)</option>
                            <option value="ytd">Lũy kế từ đầu năm (YTD 2026)</option>
                            <option value="custom">Tùy chỉnh khoảng thời gian</option>
                        </select>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => setIsExportModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span>Xuất báo cáo</span>
                    </Button>
                </div>
            </div>

            {/* Cảnh báo chế độ dữ liệu mô phỏng */}
            <Alert status="accent">
                <div className="flex items-center gap-2 text-sm">
                    <SparklesIcon className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                    <span>
                        Số liệu phân tích phục vụ dự báo và mô phỏng quản trị (Demo Analytics). Hệ
                        thống chuẩn hóa theo chuẩn Zero-Bug Policy.
                    </span>
                </div>
            </Alert>

            {exportSuccess && (
                <Alert status="warning">
                    <span>
                        Báo cáo &ldquo;{reportTitle}&rdquo; đã được biên xuất thành công sang định
                        dạng {exportFormat.toUpperCase()}!
                    </span>
                </Alert>
            )}

            {/* 4 Chỉ số KPI tài chính & vận hành nâng cao */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Doanh thu thực tế
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {formatVND(summary.totalActual)}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <CurrencyDollarIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                            Mục tiêu: {formatVND(summary.totalTarget)}
                        </span>
                        <span className="font-semibold text-emerald-600">
                            {summary.completionRate}%
                        </span>
                    </div>
                    <div className="mt-1.5">
                        <ProgressBar value={summary.completionRate} color="accent" size="sm" />
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Tổng số đơn hàng
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {summary.totalOrders.toLocaleString('vi-VN')} đơn
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <ShoppingCartIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span>Tăng +14.2% so với quý trước</span>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Giá trị đơn bình quân (AOV)
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {formatVND(summary.avgOrderValue)}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <ChartBarIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <ArrowTrendingUpIcon className="h-4 w-4" />
                        <span>Tăng +8.6% nhờ bán chéo combo</span>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Tỷ lệ kênh vượt mục tiêu
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                40% (2 / 5 kênh)
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <UsersIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-amber-600">
                        <span>Livestream & E-commerce dẫn đầu</span>
                    </div>
                </Card>
            </div>

            {/* Bảng phân tích đa kênh chuyên sâu */}
            <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-zinc-800">
                    <div>
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">
                            Ma trận hiệu suất theo kênh phân phối
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Đối chiếu doanh số thực đạt với chỉ tiêu ngân sách quý 3/2026
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Chip color="success" variant="soft" size="sm">
                            Đạt & Vượt
                        </Chip>
                        <Chip color="warning" variant="soft" size="sm">
                            Đúng lộ trình
                        </Chip>
                        <Chip color="danger" variant="soft" size="sm">
                            Chậm tiến độ
                        </Chip>
                    </div>
                </div>

                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Bảng phân tích đa kênh">
                            <Table.Header>
                                <Table.Column isRowHeader>Kênh bán hàng</Table.Column>
                                <Table.Column>Chỉ tiêu</Table.Column>
                                <Table.Column>Thực tế</Table.Column>
                                <Table.Column>Tiến độ hoàn thành</Table.Column>
                                <Table.Column>Tăng trưởng</Table.Column>
                                <Table.Column className="text-right">Đánh giá</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {CHANNELS_DATA.map((row) => {
                                    const rate = Math.round((row.actual / row.target) * 100);
                                    return (
                                        <Table.Row
                                            key={row.id}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <Table.Cell>
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                                        {row.channel}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {row.ordersCount.toLocaleString('vi-VN')}{' '}
                                                        đơn hoàn tất
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {formatVND(row.target)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                                                    {formatVND(row.actual)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="w-36 space-y-1">
                                                    <div className="flex justify-between text-[11px] font-semibold">
                                                        <span>{rate}%</span>
                                                    </div>
                                                    <ProgressBar
                                                        value={rate}
                                                        color={
                                                            rate >= 100
                                                                ? 'success'
                                                                : rate >= 80
                                                                  ? 'accent'
                                                                  : 'warning'
                                                        }
                                                        size="sm"
                                                    />
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1 text-xs font-semibold">
                                                    {row.growth >= 0 ? (
                                                        <span className="flex items-center gap-0.5 text-emerald-600">
                                                            <ArrowTrendingUpIcon className="h-3.5 w-3.5" />
                                                            +{row.growth}%
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-0.5 text-rose-600">
                                                            <ArrowTrendingDownIcon className="h-3.5 w-3.5" />
                                                            {row.growth}%
                                                        </span>
                                                    )}
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                {row.status === 'exceeded' && (
                                                    <Chip color="success" variant="soft" size="sm">
                                                        Vượt chỉ tiêu
                                                    </Chip>
                                                )}
                                                {row.status === 'on_track' && (
                                                    <Chip color="accent" variant="soft" size="sm">
                                                        Đúng tiến độ
                                                    </Chip>
                                                )}
                                                {row.status === 'lagging' && (
                                                    <Chip color="danger" variant="soft" size="sm">
                                                        Cần đẩy mạnh
                                                    </Chip>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card>

            {/* Modal Xuất Báo Cáo */}
            <Modal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Tạo và xuất báo cáo kinh doanh tổng hợp"
            >
                <form onSubmit={handleExport} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Tên báo cáo xuất:
                        </label>
                        <Input
                            value={reportTitle}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setReportTitle(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Định dạng xuất tệp:
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'excel', label: 'Excel (.xlsx)', desc: 'Bảng tính dữ liệu' },
                                { id: 'pdf', label: 'PDF Report', desc: 'Trình chiếu in ấn' },
                                { id: 'json', label: 'JSON Data', desc: 'Tích hợp API' },
                            ].map((fmt) => (
                                <button
                                    key={fmt.id}
                                    type="button"
                                    onClick={() => setExportFormat(fmt.id)}
                                    className={`rounded-xl border p-3 text-left transition-all ${
                                        exportFormat === fmt.id
                                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/30 dark:text-white'
                                            : 'border-gray-200 hover:border-gray-300 dark:border-zinc-700'
                                    }`}
                                >
                                    <p className="text-xs font-semibold">{fmt.label}</p>
                                    <p className="text-[10px] text-gray-500">{fmt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 dark:bg-zinc-800/60 dark:text-gray-300">
                        Báo cáo sẽ bao gồm số liệu chi tiết của 5 kênh bán hàng, tỷ lệ hoàn thành
                        KPI và biểu đồ tăng trưởng quý 3/2026.
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsExportModalOpen(false)}
                            isDisabled={isExporting}
                        >
                            Đóng
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            isDisabled={isExporting}
                            className="flex items-center gap-2"
                        >
                            <ArrowDownTrayIcon
                                className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`}
                            />
                            <span>{isExporting ? 'Đang kết xuất...' : 'Tải xuống tệp'}</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
