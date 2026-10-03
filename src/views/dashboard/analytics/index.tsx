'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useTheme } from '@/contexts';
import {
    ArrowDownTrayIcon,
    ArrowPathIcon,
    ArrowPathRoundedSquareIcon,
    ArrowTrendingDownIcon,
    ArrowTrendingUpIcon,
    ChartBarIcon,
    ClockIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    DeviceTabletIcon,
    EyeIcon,
    FunnelIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    MapPinIcon,
    SparklesIcon,
    UserGroupIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import type { AnalyticsDashboardData } from '@/types/analytics.types';
import { AnalyticsService } from '@/services/analytics.service';
import {
    Breadcrumb,
    Button,
    Card,
    Chip,
    Input,
    Link,
    ProgressBar,
    Select,
    SelectItem,
    Tab,
    Table,
    Tabs,
    type SortDescriptor,
} from '@/components/common';

/**
 * Chuyển chuỗi định dạng thời gian "3m 42s" hoặc "45s" thành số giây để sắp xếp chuẩn xác
 */
function parseTimeToSeconds(timeStr: string): number {
    const parts = timeStr.trim().split(' ');
    let total = 0;
    for (const part of parts) {
        if (part.endsWith('m')) {
            total += Number.parseInt(part, 10) * 60 || 0;
        } else if (part.endsWith('s')) {
            total += Number.parseInt(part, 10) || 0;
        }
    }
    return total;
}

function getBounceRateColor(rate: number): 'success' | 'warning' | 'danger' {
    if (rate < 30) return 'success';
    if (rate < 45) return 'warning';
    return 'danger';
}

function getStatusChipProps(status: string): {
    color: 'success' | 'accent' | 'warning';
    label: string;
} {
    if (status === 'optimal') return { color: 'success', label: 'Tối ưu' };
    if (status === 'good') return { color: 'accent', label: 'Khá tốt' };
    return { color: 'warning', label: 'Cần cải thiện' };
}

export function DashboardAnalytics() {
    const t = useTranslations();
    const { darkMode } = useTheme();
    const [period, setPeriod] = useState<string>('7d');
    const [activeMetric, setActiveMetric] = useState<'pageviews' | 'sessions' | 'users'>(
        'pageviews'
    );
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [analyticsData, setAnalyticsData] = useState<AnalyticsDashboardData | null>(null);
    const [tableSearch, setTableSearch] = useState('');
    const [tableStatusFilter, setTableStatusFilter] = useState<string>('all');
    const [tableSort, setTableSort] = useState<SortDescriptor>({
        column: 'views',
        direction: 'descending',
    });
    const [, startTransition] = useTransition();

    // Tải dữ liệu từ Service Layer
    const loadAnalyticsData = useCallback(async (selectedPeriod: string) => {
        try {
            const res = await AnalyticsService.getAnalyticsData(selectedPeriod);
            if ((res.returnCode === 0 || res.returnCode === 200) && res.data) {
                setAnalyticsData(res.data);
            }
        } catch {
            // Service layer đã bọc an toàn
        }
    }, []);

    useEffect(() => {
        void loadAnalyticsData(period);
    }, [loadAnalyticsData, period]);

    // Xử lý làm mới dữ liệu
    const handleRefresh = () => {
        setIsRefreshing(true);
        startTransition(() => {
            void loadAnalyticsData(period).finally(() => {
                setIsRefreshing(false);
            });
        });
    };

    const topPages = analyticsData?.topPages;
    const filteredAndSortedPages = useMemo(() => {
        if (!topPages) return [];
        let list = [...topPages];

        // Lọc theo từ khóa tìm kiếm (tiêu đề hoặc đường dẫn)
        if (tableSearch.trim()) {
            const q = tableSearch.toLowerCase().trim();
            list = list.filter(
                (p) => p.title.toLowerCase().includes(q) || p.path.toLowerCase().includes(q)
            );
        }

        // Lọc theo trạng thái đánh giá
        if (tableStatusFilter !== 'all') {
            list = list.filter((p) => p.statusType === tableStatusFilter);
        }

        // Sắp xếp
        if (tableSort?.column) {
            const col = tableSort.column as string;
            list.sort((a, b) => {
                let cmp = 0;
                if (col === 'views' || col === 'uniqueUsers' || col === 'bounceRate') {
                    cmp = (a[col] ?? 0) - (b[col] ?? 0);
                } else if (col === 'avgTime') {
                    cmp = parseTimeToSeconds(a.avgTime) - parseTimeToSeconds(b.avgTime);
                } else if (col === 'path') {
                    cmp = a.title.localeCompare(b.title, 'vi');
                } else {
                    const valA = (a as unknown as Record<string, unknown>)[col];
                    const valB = (b as unknown as Record<string, unknown>)[col];
                    const strA = typeof valA === 'string' || typeof valA === 'number' ? String(valA) : '';
                    const strB = typeof valB === 'string' || typeof valB === 'number' ? String(valB) : '';
                    cmp = strA.localeCompare(strB, 'vi');
                }
                return tableSort.direction === 'descending' ? -cmp : cmp;
            });
        }

        return list;
    }, [topPages, tableSearch, tableStatusFilter, tableSort]);

    if (!analyticsData) {
        return (
            <div className="flex h-96 items-center justify-center">
                <div className="flex items-center gap-3 text-zinc-500">
                    <ArrowPathIcon className="size-6 animate-spin text-blue-600" />
                    <span className="text-sm font-medium">Đang tải dữ liệu phân tích...</span>
                </div>
            </div>
        );
    }

    const { kpis, trafficTrend, acquisitionSources, funnelSteps, locations } = analyticsData;

    return (
        <div className="space-y-6 pb-12">
            {/* Thanh điều hướng Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: t('menu.dashboard'), href: '/dashboard' },
                    { label: 'Phân tích số liệu (Analytics)' },
                ]}
            />

            {/* Tiêu đề trang & Thanh công cụ hành động */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                            <ChartBarIcon className="size-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
                                    Trung tâm Phân tích Dữ liệu
                                </h1>
                                <Chip size="sm" color="success" variant="soft">
                                    <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
                                    {kpis.activeOnlineNow} Đang trực tuyến
                                </Chip>
                            </div>
                            <p className="text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                                Giám sát lưu lượng, hành vi khách hàng và hiệu suất chuyển đổi thời
                                gian thực
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bộ lọc thời gian & Hành động xuất file */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <div className="w-40 sm:w-44">
                        <Select
                            aria-label="Khoảng thời gian"
                            size="md"
                            selectedKey={period}
                            onSelectionChange={(key: React.Key | Iterable<React.Key> | null) => {
                                if (!key) return;
                                if (typeof key === 'string' || typeof key === 'number') {
                                    setPeriod(String(key));
                                } else if (typeof key === 'object' && Symbol.iterator in key) {
                                    const first = Array.from(key as Iterable<React.Key>)[0];
                                    if (first !== undefined) setPeriod(String(first));
                                }
                            }}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                if (e?.target?.value) setPeriod(e.target.value);
                            }}
                        >
                            <SelectItem id="24h" key="24h">
                                24 giờ qua
                            </SelectItem>
                            <SelectItem id="7d" key="7d">
                                7 ngày qua
                            </SelectItem>
                            <SelectItem id="30d" key="30d">
                                30 ngày qua
                            </SelectItem>
                            <SelectItem id="90d" key="90d">
                                Quý này (90 ngày)
                            </SelectItem>
                            <SelectItem id="1y" key="1y">
                                Toàn bộ năm
                            </SelectItem>
                        </Select>
                    </div>

                    <Button
                        variant="secondary"
                        size="md"
                        isIconOnly
                        onClick={handleRefresh}
                        aria-label="Làm mới số liệu"
                    >
                        <ArrowPathIcon className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>

                    <Button variant="primary" size="md">
                        <ArrowDownTrayIcon className="size-4" />
                        <span>Xuất báo cáo</span>
                    </Button>
                </div>
            </div>

            {/* 4 Thẻ chỉ số KPI cốt lõi (Chỉ nhận styling viền do người dùng yêu cầu, không nhồi class vào HeroUI sub-component) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* KPI 1: Lượt xem trang */}
                <Card className="border border-b-4 border-blue-500 dark:border-blue-500">
                    <Card.Content>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                Tổng lượt xem trang
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                                <EyeIcon className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums sm:text-3xl dark:text-zinc-50">
                                {kpis.pageviews.toLocaleString('vi-VN')}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-600 tabular-nums dark:bg-emerald-950/60 dark:text-emerald-400">
                                <ArrowTrendingUpIcon className="size-3" />+{kpis.pageviewsChange}%
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-500">
                                so với chu kỳ trước
                            </span>
                        </div>
                    </Card.Content>
                </Card>

                {/* KPI 2: Khách truy cập duy nhất */}
                <Card className="border border-b-4 border-emerald-500 dark:border-emerald-500">
                    <Card.Content>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                Người dùng duy nhất
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                                <UserGroupIcon className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums sm:text-3xl dark:text-zinc-50">
                                {kpis.uniqueUsers.toLocaleString('vi-VN')}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-600 tabular-nums dark:bg-emerald-950/60 dark:text-emerald-400">
                                <ArrowTrendingUpIcon className="size-3" />+{kpis.uniqueUsersChange}%
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-500">người dùng mới</span>
                        </div>
                    </Card.Content>
                </Card>

                {/* KPI 3: Thời lượng phiên */}
                <Card className="border border-b-4 border-purple-500 dark:border-purple-500">
                    <Card.Content>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                Thời gian tương tác TB
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                <ClockIcon className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums sm:text-3xl dark:text-zinc-50">
                                {kpis.avgSessionDuration}
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-600 tabular-nums dark:bg-emerald-950/60 dark:text-emerald-400">
                                <ArrowTrendingUpIcon className="size-3" />+
                                {kpis.avgSessionDurationChange}%
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-500">
                                tăng mức độ gắn bó
                            </span>
                        </div>
                    </Card.Content>
                </Card>

                {/* KPI 4: Tỷ lệ thoát */}
                <Card className="border border-b-4 border-amber-500 dark:border-amber-500">
                    <Card.Content>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                                Tỷ lệ thoát trang (Bounce Rate)
                            </span>
                            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                                <ArrowPathRoundedSquareIcon className="size-4.5" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <span className="text-2xl font-black tracking-tight text-zinc-900 tabular-nums sm:text-3xl dark:text-zinc-50">
                                {kpis.bounceRate}%
                            </span>
                        </div>
                        <div className="mt-2 flex items-center gap-1.5 text-xs">
                            <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-600 tabular-nums dark:bg-emerald-950/60 dark:text-emerald-400">
                                <ArrowTrendingDownIcon className="size-3" />
                                {kpis.bounceRateChange}%
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-500">
                                giảm thoát (Tốt)
                            </span>
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Khối chính: Biểu đồ xu hướng tương tác & Nguồn kênh lưu lượng */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Cột trái (2/3): Biểu đồ diện tích xu hướng */}
                <Card className="border border-b-4 border-blue-500 lg:col-span-2 dark:border-blue-500">
                    <Card.Header
                        icon={<SparklesIcon className="size-4" />}
                        iconColor="primary"
                        title="Xu hướng Lưu lượng & Tương tác"
                        description="Dữ liệu so sánh lượt xem trang, phiên truy cập và người dùng theo thời gian"
                        action={
                            <Tabs
                                selectedKey={activeMetric}
                                onSelectionChange={(key) =>
                                    setActiveMetric(
                                        String(key) as 'pageviews' | 'sessions' | 'users'
                                    )
                                }
                                aria-label="Chọn chỉ số hiển thị"
                            >
                                <Tab key="pageviews" title="Lượt xem" />
                                <Tab key="sessions" title="Phiên" />
                                <Tab key="users" title="Người dùng" />
                            </Tabs>
                        }
                    />
                    <Card.Content>
                        {/* Biểu đồ Recharts Area */}
                        <div className="h-72 w-full pt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={trafficTrend}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorPageviews"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#3b82f6"
                                                stopOpacity={0.0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="colorSessions"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10b981"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10b981"
                                                stopOpacity={0.0}
                                            />
                                        </linearGradient>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="#8b5cf6"
                                                stopOpacity={0.4}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8b5cf6"
                                                stopOpacity={0.0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={darkMode ? '#27272a' : '#f4f4f5'}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        stroke={darkMode ? '#71717a' : '#a1a1aa'}
                                        fontSize={12}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        stroke={darkMode ? '#71717a' : '#a1a1aa'}
                                        fontSize={12}
                                        tickLine={false}
                                        tickFormatter={(val: number) =>
                                            `${(val / 1000).toFixed(0)}k`
                                        }
                                    />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#18181b' : '#ffffff',
                                            borderColor: darkMode ? '#27272a' : '#e4e4e7',
                                            borderRadius: '0.75rem',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                            fontSize: '12px',
                                        }}
                                        formatter={(value: unknown, name: unknown) => {
                                            const num =
                                                typeof value === 'number' ? value : Number(value);
                                            let formattedValue = '';
                                            if (Number.isNaN(num)) {
                                                if (typeof value === 'string' || typeof value === 'number') {
                                                    formattedValue = String(value);
                                                }
                                            } else {
                                                formattedValue = num.toLocaleString('vi-VN');
                                            }
                                            const labels: Record<string, string> = {
                                                pageviews: 'Lượt xem trang',
                                                sessions: 'Phiên truy cập',
                                                users: 'Người dùng',
                                            };
                                            const nameKey = typeof name === 'string' || typeof name === 'number' ? String(name) : '';
                                            return [
                                                formattedValue,
                                                labels[nameKey] || nameKey,
                                            ];
                                        }}
                                    />
                                    {activeMetric === 'pageviews' && (
                                        <Area
                                            type="monotone"
                                            dataKey="pageviews"
                                            stroke="#3b82f6"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorPageviews)"
                                        />
                                    )}
                                    {activeMetric === 'sessions' && (
                                        <Area
                                            type="monotone"
                                            dataKey="sessions"
                                            stroke="#10b981"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorSessions)"
                                        />
                                    )}
                                    {activeMetric === 'users' && (
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#8b5cf6"
                                            strokeWidth={2.5}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                        />
                                    )}
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Tóm tắt nhanh chân biểu đồ */}
                        <div className="mt-4 grid grid-cols-3 border-t border-zinc-100 pt-3 text-center dark:border-zinc-800">
                            <div>
                                <span className="text-[11px] text-zinc-400">Cao nhất ngày</span>
                                <p className="font-bold text-zinc-800 tabular-nums dark:text-zinc-200">
                                    68.900 lượt
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-zinc-400">Trung bình / ngày</span>
                                <p className="font-bold text-zinc-800 tabular-nums dark:text-zinc-200">
                                    54.988 lượt
                                </p>
                            </div>
                            <div>
                                <span className="text-[11px] text-zinc-400">Tăng trưởng</span>
                                <p className="font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                                    +{kpis.pageviewsChange}%
                                </p>
                            </div>
                        </div>
                    </Card.Content>
                </Card>

                {/* Cột phải (1/3): Kênh thu hút lưu lượng truy cập */}
                <Card className="border border-b-4 border-emerald-500 dark:border-emerald-500">
                    <Card.Header
                        icon={<GlobeAltIcon className="size-4" />}
                        iconColor="success"
                        title="Kênh Thu Hút (Acquisition)"
                        action={<span className="text-[0.6875rem] text-zinc-400">Tỷ trọng %</span>}
                    />
                    <Card.Content>
                        <div className="space-y-3.5">
                            {acquisitionSources.map((source) => (
                                <div key={source.name} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <Icon
                                                icon={source.icon}
                                                className="size-4 text-zinc-500 dark:text-zinc-400"
                                            />
                                            <span className="font-medium text-zinc-800 dark:text-zinc-200">
                                                {source.name}
                                            </span>
                                        </div>
                                        <span className="font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                                            {source.percentage}%
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={source.percentage}
                                        color={source.color}
                                        size="sm"
                                        aria-label={source.name}
                                    />
                                    <div className="flex justify-end text-[10px] text-zinc-400 tabular-nums">
                                        {source.visitors.toLocaleString('vi-VN')} lượt
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Hàng 2: Phễu chuyển đổi & Phân bổ thiết bị */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Phễu chuyển đổi khách hàng (2/3) */}
                <Card className="border border-b-4 border-purple-500 lg:col-span-2 dark:border-purple-500">
                    <Card.Header
                        icon={<FunnelIcon className="size-4" />}
                        iconColor="accent"
                        title="Phễu Chuyển Đổi Khách Hàng (Conversion Funnel)"
                        description="Theo dõi tỷ lệ giữ chân và điểm rơi rụng (drop-off) qua từng giai đoạn"
                        action={
                            <Chip size="sm" color="accent" variant="soft">
                                Tỷ lệ chốt: 3.84%
                            </Chip>
                        }
                    />
                    <Card.Content>
                        <div className="space-y-4 pt-1">
                            {funnelSteps.map((step, idx) => (
                                <div
                                    key={step.step}
                                    className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3.5 transition-all hover:bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/60"
                                >
                                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="flex size-5 items-center justify-center rounded-md bg-purple-500/10 text-[11px] font-bold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                                                {idx + 1}
                                            </span>
                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                {step.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-black text-zinc-900 tabular-nums dark:text-zinc-50">
                                                {step.count.toLocaleString('vi-VN')}
                                            </span>
                                            <span className="rounded-md bg-zinc-200/70 px-1.5 py-0.5 text-[11px] font-bold text-zinc-700 tabular-nums dark:bg-zinc-700 dark:text-zinc-300">
                                                {step.conversion}%
                                            </span>
                                            {step.dropoff > 0 && (
                                                <span className="text-[11px] text-rose-500 tabular-nums">
                                                    ↓ {step.dropoff}% rời bỏ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <ProgressBar
                                        value={step.conversion}
                                        color={step.color}
                                        size="sm"
                                        aria-label={step.name}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>

                {/* Phân bổ Thiết bị & Nền tảng (1/3) */}
                <Card className="border border-b-4 border-indigo-500 dark:border-indigo-500">
                    <Card.Header
                        icon={<ComputerDesktopIcon className="size-4" />}
                        iconColor="indigo"
                        title="Thiết Bị & Nền Tảng"
                        action={<span className="text-[0.6875rem] text-zinc-400">Thị phần</span>}
                    />
                    <Card.Content>
                        {/* Donut Chart mini cho thiết bị */}
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            {
                                                name: 'Máy tính (Desktop)',
                                                value: 56.4,
                                                color: '#3b82f6',
                                            },
                                            {
                                                name: 'Điện thoại (Mobile)',
                                                value: 37.2,
                                                color: '#10b981',
                                            },
                                            {
                                                name: 'Máy tính bảng (Tablet)',
                                                value: 6.4,
                                                color: '#f59e0b',
                                            },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#10b981" />
                                        <Cell fill="#f59e0b" />
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#18181b' : '#ffffff',
                                            borderColor: darkMode ? '#27272a' : '#e4e4e7',
                                            borderRadius: '0.75rem',
                                            fontSize: '11px',
                                        }}
                                        formatter={(val: unknown) => [
                                            `${typeof val === 'string' || typeof val === 'number' ? val : ''}%`,
                                            'Tỷ trọng',
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Chi tiết 3 dòng thiết bị */}
                        <div className="mt-2 space-y-2.5">
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <ComputerDesktopIcon className="size-4 text-blue-500" />
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                        Máy tính (Desktop)
                                    </span>
                                </div>
                                <span className="font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                                    56.4% (217k)
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <DevicePhoneMobileIcon className="size-4 text-emerald-500" />
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                        Điện thoại (Mobile)
                                    </span>
                                </div>
                                <span className="font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                                    37.2% (143k)
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2">
                                    <DeviceTabletIcon className="size-4 text-amber-500" />
                                    <span className="text-zinc-700 dark:text-zinc-300">
                                        Máy tính bảng (Tablet)
                                    </span>
                                </div>
                                <span className="font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                                    6.4% (24.6k)
                                </span>
                            </div>
                        </div>
                    </Card.Content>
                </Card>
            </div>

            {/* Hàng 3: Bảng Top Trang Được Truy Cập Nhiều Nhất & Phân bổ Địa lý */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Bảng Top Trang (2/3) dùng HeroUI Table Compound */}
                <Card className="border border-b-4 border-rose-500 lg:col-span-2 dark:border-rose-500">
                    <Card.Header
                        icon={<Icon icon="solar:document-text-linear" className="size-4" />}
                        iconColor="danger"
                        title="Trang Được Truy Cập Nhiều Nhất (Top Landing Pages)"
                        description="Thống kê lượng view, thời gian đọc và tỷ lệ thoát của các liên kết"
                        action={
                            <Button variant="ghost" size="sm">
                                Xem tất cả trang
                            </Button>
                        }
                    />
                    <Card.Content>
                        {/* Filter Toolbar: Search Input + Select Filter Trạng thái */}
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-1 flex-wrap items-center gap-3">
                                {/* Ô tìm kiếm trang hoặc URL */}
                                <div className="relative w-full sm:max-w-64">
                                    <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
                                    <Input
                                        aria-label="Tìm kiếm trang"
                                        placeholder="Tìm tiêu đề hoặc URL..."
                                        value={tableSearch}
                                        onChange={(e) => setTableSearch(e.target.value)}
                                        className="w-full pl-9"
                                    />
                                    {tableSearch && (
                                        <button
                                            type="button"
                                            onClick={() => setTableSearch('')}
                                            className="absolute top-1/2 right-2.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                                            aria-label="Xóa tìm kiếm"
                                        >
                                            <XMarkIcon className="size-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown lọc theo đánh giá trạng thái */}
                                <div className="w-full sm:w-44">
                                    <Select
                                        aria-label="Lọc theo đánh giá"
                                        selectedKey={tableStatusFilter}
                                        onSelectionChange={(key) => {
                                            if (!key) {
                                                setTableStatusFilter('all');
                                                return;
                                            }
                                            if (typeof key === 'string' || typeof key === 'number') {
                                                setTableStatusFilter(String(key));
                                            } else if (typeof key === 'object' && Symbol.iterator in key) {
                                                const first = Array.from(key as Iterable<React.Key>)[0];
                                                setTableStatusFilter(first !== undefined ? String(first) : 'all');
                                            }
                                        }}
                                    >
                                        <SelectItem id="all">Tất cả trạng thái</SelectItem>
                                        <SelectItem id="optimal">Tối ưu</SelectItem>
                                        <SelectItem id="good">Khá tốt</SelectItem>
                                        <SelectItem id="needs_work">Cần cải thiện</SelectItem>
                                    </Select>
                                </div>

                                {/* Nút reset filter */}
                                {(tableSearch || tableStatusFilter !== 'all') && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onPress={() => {
                                            setTableSearch('');
                                            setTableStatusFilter('all');
                                        }}
                                    >
                                        Đặt lại
                                    </Button>
                                )}
                            </div>

                            {/* Thống kê số lượng kết quả */}
                            <div className="text-xs text-zinc-500 tabular-nums">
                                Hiển thị <strong>{filteredAndSortedPages.length}</strong> /{' '}
                                {topPages?.length ?? 0} trang
                            </div>
                        </div>

                        {/* Table HeroUI v3 Compound Component - Căn lề chuẩn chỉ định & Hỗ trợ Sort */}
                        <Table aria-label="Bảng thống kê trang được truy cập nhiều nhất">
                            <Table.ScrollContainer>
                                <Table.Content
                                    aria-label="Bảng dữ liệu trang truy cập"
                                    sortDescriptor={tableSort}
                                    onSortChange={setTableSort}
                                >
                                    <Table.Header>
                                        <Table.Column
                                            id="path"
                                            isRowHeader
                                            allowsSorting
                                            className="text-left"
                                        >
                                            {({ sortDirection }) => (
                                                <Table.SortableColumnHeader
                                                    sortDirection={sortDirection}
                                                >
                                                    Đường dẫn trang
                                                </Table.SortableColumnHeader>
                                            )}
                                        </Table.Column>
                                        <Table.Column
                                            id="views"
                                            allowsSorting
                                            className="text-right"
                                        >
                                            {({ sortDirection }) => (
                                                <Table.SortableColumnHeader
                                                    sortDirection={sortDirection}
                                                >
                                                    Lượt xem
                                                </Table.SortableColumnHeader>
                                            )}
                                        </Table.Column>
                                        <Table.Column
                                            id="uniqueUsers"
                                            allowsSorting
                                            className="text-right"
                                        >
                                            {({ sortDirection }) => (
                                                <Table.SortableColumnHeader
                                                    sortDirection={sortDirection}
                                                >
                                                    Khách duy nhất
                                                </Table.SortableColumnHeader>
                                            )}
                                        </Table.Column>
                                        <Table.Column
                                            id="avgTime"
                                            allowsSorting
                                            className="text-center"
                                        >
                                            {({ sortDirection }) => (
                                                <Table.SortableColumnHeader
                                                    sortDirection={sortDirection}
                                                >
                                                    Thời gian TB
                                                </Table.SortableColumnHeader>
                                            )}
                                        </Table.Column>
                                        <Table.Column
                                            id="bounceRate"
                                            allowsSorting
                                            className="text-right"
                                        >
                                            {({ sortDirection }) => (
                                                <Table.SortableColumnHeader
                                                    sortDirection={sortDirection}
                                                >
                                                    Tỷ lệ thoát
                                                </Table.SortableColumnHeader>
                                            )}
                                        </Table.Column>
                                        <Table.Column id="status" className="text-center">
                                            Đánh giá
                                        </Table.Column>
                                    </Table.Header>
                                    <Table.Body
                                        renderEmptyState={() => (
                                            <div className="flex w-full flex-col items-center justify-center py-8 text-xs text-zinc-400">
                                                Không tìm thấy trang nào phù hợp với bộ lọc
                                            </div>
                                        )}
                                    >
                                        {filteredAndSortedPages.map((page) => (
                                            <Table.Row key={page.id} id={page.id}>
                                                <Table.Cell className="text-left">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {page.title}
                                                        </span>
                                                        <Link
                                                            href={page.path}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-zinc-400 transition-colors hover:text-blue-500 dark:text-zinc-500 dark:hover:text-blue-400"
                                                        >
                                                            <span>{page.path}</span>
                                                            <Link.Icon className="size-3" />
                                                        </Link>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell className="text-right font-bold tabular-nums">
                                                    {page.views.toLocaleString('vi-VN')}
                                                </Table.Cell>
                                                <Table.Cell className="text-right tabular-nums">
                                                    {page.uniqueUsers.toLocaleString('vi-VN')}
                                                </Table.Cell>
                                                <Table.Cell className="text-center font-mono tabular-nums">
                                                    {page.avgTime}
                                                </Table.Cell>
                                                <Table.Cell className="text-right tabular-nums">
                                                    <div className="flex justify-end">
                                                        <Chip
                                                            size="sm"
                                                            variant="soft"
                                                            color={getBounceRateColor(page.bounceRate)}
                                                        >
                                                            {page.bounceRate}%
                                                        </Chip>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell className="text-center">
                                                    {(() => {
                                                        const statusInfo = getStatusChipProps(page.statusType);
                                                        return (
                                                            <Chip
                                                                size="sm"
                                                                variant="soft"
                                                                color={statusInfo.color}
                                                            >
                                                                {statusInfo.label}
                                                            </Chip>
                                                        );
                                                    })()}
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Content>
                            </Table.ScrollContainer>
                        </Table>
                    </Card.Content>
                </Card>

                {/* Phân bổ Địa lý (1/3) */}
                <Card className="border border-b-4 border-teal-500 dark:border-teal-500">
                    <Card.Header
                        icon={<MapPinIcon className="size-4" />}
                        iconColor="teal"
                        title="Phân Bổ Địa Lý (Top Locations)"
                        action={<span className="text-[0.6875rem] text-zinc-400">Việt Nam</span>}
                    />
                    <Card.Content>
                        <div className="space-y-3.5">
                            {locations.map((loc) => (
                                <div key={loc.city} className="space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <div>
                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                {loc.city}
                                            </span>
                                            <span className="ml-1 text-[11px] text-zinc-400">
                                                ({loc.country})
                                            </span>
                                        </div>
                                        <span className="font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
                                            {loc.percentage}%
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={loc.percentage}
                                        color="success"
                                        size="sm"
                                        aria-label={loc.city}
                                    />
                                    <div className="flex items-center justify-between text-[11px] text-zinc-400 tabular-nums">
                                        <span>{loc.sessions.toLocaleString('vi-VN')} phiên</span>
                                        <span>Chi tiêu TB: {loc.revenueAvg}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            </div>
        </div>
    );
}
