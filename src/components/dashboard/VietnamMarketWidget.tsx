'use client';

import { useCallback, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import type { BankItem, CurrencyItem, GoldPriceItem, PetrolItem } from '@/types/utility.types';
import { UtilityService } from '@/services/utility.service';
import { Avatar, Button, Card, Chip, Tab, Table, Tabs } from '@/components/common';

type MarketTab = 'overview' | 'currency' | 'gold' | 'petrol' | 'banks';

/**
 * Định dạng giá trị an toàn, xử lý triệt để lỗi NaN khi parse chuỗi có dấu phẩy hoặc đơn vị
 */
function formatDisplayValue(raw: string | number | undefined, suffix = 'đ'): string {
    if (raw === undefined || raw === null || raw === '') return '--';
    if (typeof raw === 'number') {
        return `${raw.toLocaleString('vi-VN')} ${suffix}`;
    }
    const str = String(raw).trim();
    if (str.includes('đ') || str.includes('₫') || str.includes('/lít') || str.includes('/kg')) {
        return str;
    }
    const normalized = str.replace(/,/g, '');
    const num = parseFloat(normalized);
    if (!isNaN(num)) {
        return `${num.toLocaleString('vi-VN')} ${suffix}`;
    }
    return `${str} ${suffix}`;
}

/**
 * Icon cờ tiền tệ SVG phong cách phẳng
 */
const CURRENCY_ICONS: Record<string, { icon: string; label: string }> = {
    USD: { icon: 'circle-flags:us', label: 'Đô la Mỹ' },
    EUR: { icon: 'circle-flags:eu', label: 'Đồng Euro' },
    GBP: { icon: 'circle-flags:gb', label: 'Bảng Anh' },
    JPY: { icon: 'circle-flags:jp', label: 'Yên Nhật' },
    SGD: { icon: 'circle-flags:sg', label: 'Đô la Singapore' },
    AUD: { icon: 'circle-flags:au', label: 'Đô la Úc' },
};

export function VietnamMarketWidget() {
    const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
    const [goldPrices, setGoldPrices] = useState<GoldPriceItem[]>([]);
    const [petrol, setPetrol] = useState<PetrolItem[]>([]);
    const [banks, setBanks] = useState<BankItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<MarketTab>('overview');
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const fetchMarketData = useCallback(async () => {
        setLoading(true);
        try {
            const [curRes, goldRes, petrolRes, bankRes] = await Promise.all([
                UtilityService.getCurrencyRates().catch(() => null),
                UtilityService.getGoldPrices().catch(() => null),
                UtilityService.getPetrolPrices().catch(() => null),
                UtilityService.getBanks().catch(() => null),
            ]);

            if (curRes?.data && Array.isArray(curRes.data)) {
                setCurrencies(curRes.data);
            }

            if (goldRes?.data && Array.isArray(goldRes.data)) {
                setGoldPrices(goldRes.data);
            }

            if (petrolRes?.data && Array.isArray(petrolRes.data)) {
                setPetrol(petrolRes.data);
            }

            if (bankRes?.data && Array.isArray(bankRes.data)) {
                setBanks(bankRes.data);
            }

            const now = new Date();
            setLastUpdated(
                now.toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                })
            );
        } catch (error) {
            console.error('Failed to load Vietnam market data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMarketData();
    }, [fetchMarketData]);

    const popularCurrencies = currencies.filter((c) =>
        ['USD', 'EUR', 'JPY', 'GBP'].includes(c.currencyCode)
    );
    const displayCurrencies =
        popularCurrencies.length > 0 ? popularCurrencies : currencies.slice(0, 4);

    return (
        <Card className="relative overflow-hidden border border-b-4 border-emerald-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-emerald-500 dark:bg-zinc-900/90">
            {/* Background ambient gradient glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />

            {/* Header: Title, Live indicator & Controls */}
            <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20">
                        <Icon icon="solar:chart-2-bold" className="size-5 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                                Thị trường Việt Nam
                            </h3>
                            <Chip
                                size="sm"
                                color="success"
                                variant="soft"
                                className="gap-1 border-0 font-medium"
                            >
                                <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                Trực tuyến
                            </Chip>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Cổng dữ liệu thời gian thực: Ngoại tệ VCB • Vàng SJC/DOJI • Xăng dầu
                            Petrolimex • VietQR Gateway
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {lastUpdated && (
                        <span className="hidden text-xs text-zinc-400 tabular-nums sm:inline">
                            Đồng bộ lúc: {lastUpdated}
                        </span>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        isIconOnly
                        aria-label="Làm mới dữ liệu"
                        onPress={fetchMarketData}
                        isDisabled={loading}
                        className="rounded-lg text-zinc-600 transition-transform active:scale-95 dark:text-zinc-300"
                    >
                        <Icon
                            icon="solar:refresh-linear"
                            className={`size-4 ${loading ? 'animate-spin text-emerald-500' : ''}`}
                        />
                    </Button>
                </div>
            </div>

            {/* HeroUI v3 Tabs */}
            <Tabs
                aria-label="Các phân hệ thị trường Việt Nam"
                selectedKey={activeTab}
                onSelectionChange={(key: React.Key) => {
                    const newTab = String(key) as MarketTab;
                    if (activeTab !== newTab) {
                        setActiveTab(newTab);
                    }
                }}
            >
                {/* TAB 1: TỔNG QUAN (3 CỘT ĐỈNH CAO DÙNG CARD HEROUI) */}
                <Tab
                    key="overview"
                    id="overview"
                    title={
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Icon icon="solar:widget-2-bold" className="size-3.5" />
                            <span>Tổng quan</span>
                        </div>
                    }
                >
                    {loading ? (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="h-44 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                            <div className="h-44 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                            <div className="h-44 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            {/* Card 1: Tỷ giá Ngoại tệ VCB */}
                            <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-b-4 border-blue-500 bg-linear-to-b from-blue-50/40 to-white/70 p-4 transition-all duration-300 hover:shadow-lg dark:border-blue-500 dark:from-blue-950/20 dark:to-zinc-900/60">
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                                <Icon
                                                    icon="solar:dollar-minimalistic-bold"
                                                    className="size-4"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold tracking-wider text-blue-900 uppercase dark:text-blue-200">
                                                    Tỷ giá Ngoại tệ
                                                </h4>
                                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                                    Vietcombank Live
                                                </span>
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color="accent"
                                            className="h-5 text-[10px] font-semibold"
                                        >
                                            Bán ra
                                        </Chip>
                                    </div>

                                    <div className="space-y-2">
                                        {displayCurrencies.map((c) => {
                                            const meta = CURRENCY_ICONS[c.currencyCode] || {
                                                icon: 'solar:bill-bold',
                                                label: c.currencyName,
                                            };
                                            return (
                                                <div
                                                    key={c.currencyCode}
                                                    className="flex items-center justify-between rounded-xl bg-white/80 px-2.5 py-1.5 shadow-sm transition-colors hover:bg-blue-50/60 dark:bg-zinc-800/80 dark:hover:bg-zinc-800"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Icon
                                                            icon={meta.icon}
                                                            className="size-4 rounded-full shadow-sm"
                                                        />
                                                        <div>
                                                            <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                                                {c.currencyCode}
                                                            </span>
                                                            <span className="ml-1.5 hidden text-[10px] text-zinc-400 sm:inline">
                                                                {meta.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-xs font-bold text-zinc-900 tabular-nums dark:text-zinc-50">
                                                            {formatDisplayValue(c.sell)}
                                                        </div>
                                                        <div className="text-[10px] text-zinc-400 tabular-nums">
                                                            Mua: {formatDisplayValue(c.buy)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-blue-100/50 pt-2 text-[11px] text-blue-700 dark:border-blue-900/30 dark:text-blue-300">
                                    <span className="truncate">Biểu tỷ giá chuyển đổi VCB</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                        onPress={() => setActiveTab('currency')}
                                    >
                                        Xem đủ ({currencies.length})
                                        <Icon
                                            icon="solar:alt-arrow-right-linear"
                                            className="ml-0.5 size-3"
                                        />
                                    </Button>
                                </div>
                            </Card>

                            {/* Card 2: Giá vàng SJC & DOJI */}
                            <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-b-4 border-amber-500 bg-linear-to-b from-amber-50/40 to-white/70 p-4 transition-all duration-300 hover:shadow-lg dark:border-amber-500 dark:from-amber-950/20 dark:to-zinc-900/60">
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                                <Icon
                                                    icon="solar:medal-star-bold"
                                                    className="size-4"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold tracking-wider text-amber-900 uppercase dark:text-amber-200">
                                                    Giá vàng Việt Nam
                                                </h4>
                                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                                    SJC • DOJI • PNJ
                                                </span>
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color="warning"
                                            className="h-5 text-[10px] font-semibold"
                                        >
                                            Miếng & Nhẫn
                                        </Chip>
                                    </div>

                                    <div className="space-y-2">
                                        {goldPrices.slice(0, 3).map((g, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between rounded-xl bg-white/80 px-2.5 py-1.5 shadow-sm transition-colors hover:bg-amber-50/60 dark:bg-zinc-800/80 dark:hover:bg-zinc-800"
                                            >
                                                <div className="min-w-0 pr-2">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                                            {g.company || 'SJC'}
                                                        </span>
                                                        <span className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-100">
                                                            {g.type}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-zinc-400 tabular-nums">
                                                        Mua: {formatDisplayValue(g.buy)}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-amber-700 tabular-nums dark:text-amber-400">
                                                        {formatDisplayValue(g.sell)}
                                                    </div>
                                                    <div className="text-[9px] text-zinc-400">
                                                        Bán ra
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-amber-100/50 pt-2 text-[11px] text-amber-700 dark:border-amber-900/30 dark:text-amber-300">
                                    <span className="truncate">Niêm yết VNĐ / Lượng</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-1.5 text-[11px] font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
                                        onPress={() => setActiveTab('gold')}
                                    >
                                        Bảng chi tiết ({goldPrices.length})
                                        <Icon
                                            icon="solar:alt-arrow-right-linear"
                                            className="ml-0.5 size-3"
                                        />
                                    </Button>
                                </div>
                            </Card>

                            {/* Card 3: Xăng dầu Petrolimex */}
                            <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-b-4 border-rose-500 bg-linear-to-b from-rose-50/40 to-white/70 p-4 transition-all duration-300 hover:shadow-lg dark:border-rose-500 dark:from-rose-950/20 dark:to-zinc-900/60">
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                                                <Icon
                                                    icon="solar:gas-station-bold"
                                                    className="size-4"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold tracking-wider text-rose-900 uppercase dark:text-rose-200">
                                                    Xăng dầu Petrolimex
                                                </h4>
                                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                                    Biểu giá Vùng 1
                                                </span>
                                            </div>
                                        </div>
                                        <Chip
                                            size="sm"
                                            variant="soft"
                                            color="danger"
                                            className="h-5 text-[10px] font-semibold"
                                        >
                                            Kỳ điều hành
                                        </Chip>
                                    </div>

                                    <div className="space-y-2">
                                        {petrol.slice(0, 3).map((p, idx) => {
                                            const isIncrease = p.change?.includes('+');
                                            const isDecrease = p.change?.includes('-');
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-xl bg-white/80 px-2.5 py-1.5 shadow-sm transition-colors hover:bg-rose-50/60 dark:bg-zinc-800/80 dark:hover:bg-zinc-800"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="size-2 rounded-full bg-rose-500" />
                                                        <span className="text-xs font-medium text-zinc-800 dark:text-zinc-100">
                                                            {p.type}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-right">
                                                        <div className="text-xs font-bold text-zinc-900 tabular-nums dark:text-zinc-50">
                                                            {formatDisplayValue(p.price, 'đ/lít')}
                                                        </div>
                                                        {p.change && (
                                                            <span
                                                                className={`rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                                                                    isIncrease
                                                                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                                                                        : isDecrease
                                                                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                                                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                                }`}
                                                            >
                                                                {p.change}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="mt-3 flex items-center justify-between border-t border-rose-100/50 pt-2 text-[11px] text-rose-700 dark:border-rose-900/30 dark:text-rose-300">
                                    <span className="truncate">Áp dụng cho chuỗi phân phối</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 px-1.5 text-[11px] font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                                        onPress={() => setActiveTab('petrol')}
                                    >
                                        Xem tất cả ({petrol.length})
                                        <Icon
                                            icon="solar:alt-arrow-right-linear"
                                            className="ml-0.5 size-3"
                                        />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </Tab>

                {/* TAB 2: CHI TIẾT TỶ GIÁ NGOẠI TỆ VCB (DÙNG TABLE HEROUI) */}
                <Tab
                    key="currency"
                    id="currency"
                    title={
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Icon icon="solar:dollar-minimalistic-bold" className="size-3.5" />
                            <span>Tỷ giá VCB ({currencies.length})</span>
                        </div>
                    }
                >
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Bảng tỷ giá ngoại tệ Vietcombank">
                                <Table.Header>
                                    <Table.Column isRowHeader>Mã ngoại tệ</Table.Column>
                                    <Table.Column>Tên ngoại tệ</Table.Column>
                                    <Table.Column className="text-right">Mua tiền mặt</Table.Column>
                                    <Table.Column className="text-right">
                                        Mua chuyển khoản
                                    </Table.Column>
                                    <Table.Column className="text-right">Bán ra</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {currencies.map((c) => {
                                        const meta = CURRENCY_ICONS[c.currencyCode] || {
                                            icon: 'solar:bill-bold',
                                            label: c.currencyName,
                                        };
                                        return (
                                            <Table.Row
                                                key={c.currencyCode}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                            >
                                                <Table.Cell className="font-bold text-zinc-900 dark:text-zinc-100">
                                                    <div className="flex items-center gap-2">
                                                        <Icon icon={meta.icon} className="size-4" />
                                                        <span>{c.currencyCode}</span>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell className="text-zinc-600 dark:text-zinc-300">
                                                    {c.currencyName}
                                                </Table.Cell>
                                                <Table.Cell className="text-right text-zinc-700 tabular-nums dark:text-zinc-300">
                                                    {formatDisplayValue(c.buy)}
                                                </Table.Cell>
                                                <Table.Cell className="text-right font-medium text-blue-600 tabular-nums dark:text-blue-400">
                                                    {formatDisplayValue(c.transfer)}
                                                </Table.Cell>
                                                <Table.Cell className="text-right font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                                                    {formatDisplayValue(c.sell)}
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </Tab>

                {/* TAB 3: CHI TIẾT GIÁ VÀNG (DÙNG TABLE HEROUI) */}
                <Tab
                    key="gold"
                    id="gold"
                    title={
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Icon icon="solar:medal-star-bold" className="size-3.5" />
                            <span>Giá vàng SJC ({goldPrices.length})</span>
                        </div>
                    }
                >
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Bảng giá vàng Việt Nam SJC DOJI PNJ">
                                <Table.Header>
                                    <Table.Column isRowHeader>Doanh nghiệp</Table.Column>
                                    <Table.Column>Loại vàng</Table.Column>
                                    <Table.Column className="text-right">Giá Mua vào</Table.Column>
                                    <Table.Column className="text-right">Giá Bán ra</Table.Column>
                                    <Table.Column className="text-center">Trạng thái</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {goldPrices.map((g, idx) => (
                                        <Table.Row
                                            key={idx}
                                            className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <Table.Cell>
                                                <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                                                    {g.company || 'SJC'}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell className="font-medium text-zinc-900 dark:text-zinc-100">
                                                {g.type}
                                            </Table.Cell>
                                            <Table.Cell className="text-right text-zinc-700 tabular-nums dark:text-zinc-300">
                                                {formatDisplayValue(g.buy)}
                                            </Table.Cell>
                                            <Table.Cell className="text-right font-bold text-amber-600 tabular-nums dark:text-amber-400">
                                                {formatDisplayValue(g.sell)}
                                            </Table.Cell>
                                            <Table.Cell className="text-center">
                                                <Chip
                                                    size="sm"
                                                    variant="soft"
                                                    color="success"
                                                    className="h-5 text-[10px]"
                                                >
                                                    Khớp lệnh
                                                </Chip>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </Tab>

                {/* TAB 4: CHI TIẾT XĂNG DẦU (DÙNG CARD HEROUI) */}
                <Tab
                    key="petrol"
                    id="petrol"
                    title={
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Icon icon="solar:gas-station-bold" className="size-3.5" />
                            <span>Xăng dầu ({petrol.length})</span>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {petrol.map((p, idx) => {
                            const isIncrease = p.change?.includes('+');
                            const isDecrease = p.change?.includes('-');
                            return (
                                <Card
                                    key={idx}
                                    className="border border-b-4 border-rose-500 bg-white p-3.5 shadow-sm transition-all hover:shadow-md dark:border-rose-500 dark:bg-zinc-800/60"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                            {p.type}
                                        </span>
                                        {p.change && (
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums ${
                                                    isIncrease
                                                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                                                        : isDecrease
                                                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                                                          : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                                                }`}
                                            >
                                                {p.change}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-lg font-extrabold text-zinc-900 tabular-nums dark:text-zinc-50">
                                        {formatDisplayValue(p.price, 'đ/lít')}
                                    </div>
                                    <span className="text-[10px] text-zinc-400">
                                        Niêm yết Petrolimex Vùng 1
                                    </span>
                                </Card>
                            );
                        })}
                    </div>
                </Tab>

                {/* TAB 5: MẠNG LƯỚI NGÂN HÀNG VIETQR (DÙNG CARD & AVATAR HEROUI) */}
                <Tab
                    key="banks"
                    id="banks"
                    title={
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Icon icon="solar:card-2-bold" className="size-3.5" />
                            <span>Cổng VietQR ({banks.length})</span>
                        </div>
                    }
                >
                    <div>
                        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                            <span>Mạng lưới thanh toán liên ngân hàng NAPAS / VietQR Gateway</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {banks.length} ngân hàng kết nối
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {banks.map((b) => (
                                <Card
                                    key={b.id}
                                    className="flex flex-row items-center gap-2.5 rounded-xl border border-b-4 border-emerald-500 bg-white/80 p-2.5 shadow-sm transition-all hover:shadow-md dark:border-emerald-500 dark:bg-zinc-800/80"
                                >
                                    <Avatar
                                        size="sm"
                                        className="border border-zinc-100 bg-white p-0.5 dark:border-zinc-700"
                                    >
                                        {b.logo ? (
                                            <Avatar.Image
                                                src={b.logo}
                                                alt={b.shortName || b.code}
                                            />
                                        ) : null}
                                        <Avatar.Fallback>
                                            {(b.code || 'VN').slice(0, 2)}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="truncate text-xs font-bold text-zinc-800 dark:text-zinc-100">
                                            {b.shortName || b.code}
                                        </div>
                                        <div className="text-[10px] text-zinc-400 tabular-nums">
                                            BIN: {b.bin}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </Tab>
            </Tabs>

            {/* Footer Widget: Nguồn API và Nhãn Cảnh Báo An Toàn */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 text-[11px] text-zinc-400 dark:border-zinc-800/80">
                <div className="flex items-center gap-1.5">
                    <Icon icon="solar:shield-check-bold" className="size-3.5 text-emerald-500" />
                    <span>Cổng dữ liệu thị trường trực tuyến • VietQR Open API</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-400">
                        Cập nhật theo chu kỳ giao dịch
                    </span>
                </div>
            </div>
        </Card>
    );
}
