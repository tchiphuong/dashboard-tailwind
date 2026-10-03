import { useState, useEffect, useMemo, useCallback } from 'react';
import { Breadcrumb } from '@/components/layout';
import { UtilityService } from '@/services/utility.service';
import type { CurrencyItem, GoldPriceItem, PetrolItem } from '@/types/utility.types';
import { Card, Button, Input, Table, ProgressBar, Chip } from '@/components/common';
import {
    ArrowPathIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    ChartPieIcon,
    BuildingOfficeIcon,
    CalculatorIcon,
} from '@heroicons/react/24/outline';
import { Icon } from '@iconify/react';

import { FinanceService } from '@/services/finance.service';
import type { DepartmentBudget } from '@/types/finance.types';

export function FinanceBudgets() {
    const [budgets, setBudgets] = useState<DepartmentBudget[]>([]);
    const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
    const [goldPrices, setGoldPrices] = useState<GoldPriceItem[]>([]);
    const [petrolPrices, setPetrolPrices] = useState<PetrolItem[]>([]);
    const [loadingMarket, setLoadingMarket] = useState(false);

    // Máy tính quy đổi ngoại tệ
    const [calcAmount, setCalcAmount] = useState<number>(1000);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

    const loadMarketData = useCallback(async () => {
        setLoadingMarket(true);
        try {
            const [curRes, goldRes, petRes, budgetRes] = await Promise.allSettled([
                UtilityService.getCurrencyRates(),
                UtilityService.getGoldPrices(),
                UtilityService.getPetrolPrices(),
                FinanceService.getDepartmentBudgets(),
            ]);

            if (curRes.status === 'fulfilled' && curRes.value.data) {
                setCurrencies(curRes.value.data);
            }
            if (goldRes.status === 'fulfilled' && goldRes.value.data) {
                setGoldPrices(goldRes.value.data);
            }
            if (petRes.status === 'fulfilled' && petRes.value.data) {
                setPetrolPrices(petRes.value.data);
            }
            if (budgetRes.status === 'fulfilled' && budgetRes.value.data) {
                setBudgets(budgetRes.value.data);
            }
        } catch {
            // Fallback có sẵn
        } finally {
            setLoadingMarket(false);
        }
    }, []);

    useEffect(() => {
        loadMarketData();
    }, [loadMarketData]);

    const stats = useMemo(() => {
        const totalAllocated = budgets.reduce((acc, curr) => acc + curr.allocated, 0);
        const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
        const remaining = totalAllocated - totalSpent;
        const rate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
        return { totalAllocated, totalSpent, remaining, rate };
    }, [budgets]);

    const formatVND = (num: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
    };

    // Tính giá trị quy đổi sang VND
    const convertedVND = useMemo(() => {
        const item = currencies.find((c) => c.currencyCode === selectedCurrency);
        if (!item) return calcAmount * 25400;
        const rate = typeof item.transfer === 'number' ? item.transfer : parseFloat(String(item.transfer).replace(/,/g, '')) || 25400;
        return calcAmount * rate;
    }, [currencies, selectedCurrency, calcAmount]);

    return (
        <div className="space-y-6">
            <Breadcrumb items={[{ label: 'Tài chính', href: '#' }, { label: 'Quản lý Ngân sách & Thị trường' }]} />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                        Kế Hoạch Ngân Sách & Dự Báo Thị Trường
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        Hệ thống tài chính doanh nghiệp chuẩn 100% HeroUI v3 (Table, ProgressBar, Card, Chip, Button), tích hợp Live API Gateway
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        isLoading={loadingMarket}
                        onClick={loadMarketData}
                        startContent={<ArrowPathIcon className="h-4 w-4" />}
                    >
                        Làm mới Tỷ giá Thị trường
                    </Button>
                </div>
            </div>

            {/* Thống kê ngân sách 4 thẻ dùng Card HeroUI */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tổng ngân sách năm</span>
                        <CurrencyDollarIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                        {formatVND(stats.totalAllocated)}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Được phê duyệt cho 5 khối phòng ban</p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Đã giải ngân</span>
                        <ArrowTrendingUpIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                        {formatVND(stats.totalSpent)}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Tiến độ chi tiêu thực tế</p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Hạn mức khả dụng</span>
                        <BuildingOfficeIcon className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {formatVND(stats.remaining)}
                    </div>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Số dư còn lại trong quý</p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Tỷ lệ giải ngân</span>
                        <ChartPieIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="mt-3 text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        {stats.rate.toFixed(1)}%
                    </div>
                    <div className="mt-3">
                        <ProgressBar aria-label="Tỷ lệ giải ngân tổng thể" color="accent" size="sm" value={Math.min(stats.rate, 100)}>
                            <ProgressBar.Track>
                                <ProgressBar.Fill />
                            </ProgressBar.Track>
                        </ProgressBar>
                    </div>
                </Card>
            </div>

            {/* Bảng phân bổ ngân sách các phòng ban dùng Table HeroUI v3 */}
            <Card className="overflow-hidden p-0">
                <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        Phân Bổ Ngân Sách Khối Phòng Ban
                    </h2>
                </div>
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Bảng phân bổ ngân sách" className="min-w-[700px]">
                            <Table.Header>
                                <Table.Column isRowHeader className="text-left">Phòng ban / đơn vị</Table.Column>
                                <Table.Column className="text-left">Người quản lý</Table.Column>
                                <Table.Column className="text-right">Ngân sách được cấp</Table.Column>
                                <Table.Column className="text-right">Đã giải ngân</Table.Column>
                                <Table.Column className="text-right">Hạn mức còn lại</Table.Column>
                                <Table.Column className="text-right">Tiến độ</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {budgets.map((b) => {
                                    const percent = b.allocated > 0 ? (b.spent / b.allocated) * 100 : 0;
                                    const remain = b.allocated - b.spent;
                                    const pbColor = percent > 90 ? 'danger' : percent > 70 ? 'warning' : 'success';
                                    return (
                                        <Table.Row key={b.id}>
                                            <Table.Cell className="text-left font-medium text-zinc-900 dark:text-zinc-100">
                                                {b.department}
                                            </Table.Cell>
                                            <Table.Cell className="text-left text-zinc-600 dark:text-zinc-300">
                                                {b.manager}
                                            </Table.Cell>
                                            <Table.Cell className="text-right font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums">
                                                {formatVND(b.allocated)}
                                            </Table.Cell>
                                            <Table.Cell className="text-right font-medium text-amber-600 dark:text-amber-400 tabular-nums">
                                                {formatVND(b.spent)}
                                            </Table.Cell>
                                            <Table.Cell className="text-right font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">
                                                {formatVND(remain)}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="w-28">
                                                        <ProgressBar
                                                            aria-label={`Tiến độ ${b.department}`}
                                                            color={pbColor}
                                                            size="sm"
                                                            value={Math.min(percent, 100)}
                                                        >
                                                            <ProgressBar.Track>
                                                                <ProgressBar.Fill />
                                                            </ProgressBar.Track>
                                                        </ProgressBar>
                                                    </div>
                                                    <span className="w-9 text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 tabular-nums">
                                                        {percent.toFixed(0)}%
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card>

            {/* Phân hệ Tích hợp Gateway: Tỷ giá ngoại tệ & Máy tính quy đổi */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Máy tính quy đổi ngân sách ngoại tệ */}
                <Card className="p-5">
                    <div className="flex items-center gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                            <CalculatorIcon className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Quy Đổi Ngân Sách Ngoại Tệ</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Tỷ giá chuyển khoản Vietcombank trực tuyến</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <Input
                            label="Số tiền ngoại tệ"
                            type="number"
                            min="1"
                            value={String(calcAmount)}
                            onValueChange={(val: string) => setCalcAmount(Number(val))}
                        />

                        <div>
                            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                Loại ngoại tệ
                            </label>
                            <select
                                value={selectedCurrency}
                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                            >
                                {currencies.map((c) => (
                                    <option key={c.currencyCode} value={c.currencyCode}>
                                        {c.currencyCode} - {c.currencyName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/30">
                            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Giá trị quy đổi dự toán (VND):</span>
                            <div className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                                {formatVND(convertedVND)}
                            </div>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                Tự động nhân theo tỷ giá chuyển khoản của Vietcombank từ Open Gateway API.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Bảng Tỷ giá ngoại tệ Vietcombank dùng Table HeroUI v3 */}
                <Card className="overflow-hidden p-0">
                    <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <Icon icon="solar:global-bold" className="h-5 w-5 text-emerald-500" />
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Tỷ Giá Ngoại Tệ (VCB)</h3>
                        </div>
                        <Chip color="success" variant="soft" size="sm">
                            Live API
                        </Chip>
                    </div>

                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Bảng tỷ giá ngoại tệ">
                                <Table.Header>
                                    <Table.Column isRowHeader className="text-left">Mã tệ</Table.Column>
                                    <Table.Column className="text-right">Mua CK</Table.Column>
                                    <Table.Column className="text-right">Bán</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {currencies.slice(0, 6).map((c) => (
                                        <Table.Row key={c.currencyCode}>
                                            <Table.Cell className="text-left font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                                {c.currencyCode}
                                            </Table.Cell>
                                            <Table.Cell className="text-right font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">
                                                {typeof c.transfer === 'number' ? c.transfer.toLocaleString('vi-VN') : c.transfer}
                                            </Table.Cell>
                                            <Table.Cell className="text-right font-medium text-zinc-900 dark:text-zinc-100 tabular-nums">
                                                {typeof c.sell === 'number' ? c.sell.toLocaleString('vi-VN') : c.sell}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </Card>

                {/* Bảng Giá Vàng SJC & Giá Xăng Dầu */}
                <Card className="p-5">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <Icon icon="solar:gas-station-bold" className="h-5 w-5 text-amber-500" />
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Giá Vàng & Xăng Dầu</h3>
                        </div>
                        <Chip color="warning" variant="soft" size="sm">
                            Petrolimex / SJC
                        </Chip>
                    </div>

                    <div className="mt-3 space-y-3">
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Xăng Dầu (VND/lít)
                            </span>
                            <div className="mt-1 space-y-1">
                                {petrolPrices.slice(0, 3).map((p) => (
                                    <div
                                        key={p.type}
                                        className="flex items-center justify-between rounded-md bg-zinc-50 px-2.5 py-1.5 text-xs dark:bg-zinc-800/50"
                                    >
                                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{p.type}</span>
                                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                                            {typeof p.price === 'number' ? p.price.toLocaleString('vi-VN') : p.price} đ
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Vàng SJC (triệu VND/lượng)
                            </span>
                            <div className="mt-1 space-y-1">
                                {goldPrices.slice(0, 2).map((g) => (
                                    <div
                                        key={g.type}
                                        className="flex items-center justify-between rounded-md bg-zinc-50 px-2.5 py-1.5 text-xs dark:bg-zinc-800/50"
                                    >
                                        <span className="font-medium text-zinc-800 dark:text-zinc-200">{g.type}</span>
                                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                            Mua: {g.buy} | Bán: {g.sell}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
