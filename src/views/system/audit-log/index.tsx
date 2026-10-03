'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
    Card,
    Button,
    Table,
    Chip,
    Input,
    Modal,
    Alert,
    Badge,
    ProgressBar,
    Select,
    SelectItem,
} from '@/components/common';
import { Skeleton } from '@heroui/react';
import {
    ShieldCheckIcon,
    GlobeAltIcon,
    UserIcon,
    ArrowPathIcon,
    ArrowDownTrayIcon,
    EyeIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { AuditLogService, type AuditLogItem } from '@/services/audit-log.service';

export function AuditLogPage() {
    const t = useTranslations();
    const [logs, setLogs] = useState<AuditLogItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedModule, setSelectedModule] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [activeLog, setActiveLog] = useState<AuditLogItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await AuditLogService.list({
                module: selectedModule === 'all' ? undefined : selectedModule,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                search: searchTerm || undefined,
            });
            if (res.data) {
                setLogs(res.data);
            }
        } catch {
            // Error handled by interceptor
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [searchTerm, selectedModule, selectedStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLogs();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchLogs]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchLogs();
    };

    // Lọc dữ liệu theo từ khóa, module và trạng thái
    const filteredLogs = useMemo(() => {
        return logs.filter((item) => {
            const matchesSearch =
                item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.ipAddress.includes(searchTerm) ||
                (item.location ?? '').toLowerCase().includes(searchTerm.toLowerCase());

            const matchesModule = selectedModule === 'all' || item.module === selectedModule;
            const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

            return matchesSearch && matchesModule && matchesStatus;
        });
    }, [logs, searchTerm, selectedModule, selectedStatus]);

    // Thống kê nhanh
    const stats = useMemo(() => {
        const total = logs.length;
        const dangers = logs.filter((l) => l.status === 'danger').length;
        const warnings = logs.filter((l) => l.status === 'warning').length;
        const successes = logs.filter((l) => l.status === 'success').length;
        const safetyScore = total > 0 ? Math.round((successes / total) * 100) : 100;
        return { total, dangers, warnings, successes, safetyScore };
    }, [logs]);

    const handleViewDetail = (item: AuditLogItem) => {
        setActiveLog(item);
        setIsDetailOpen(true);
    };

    const handleExportJson = () => {
        const dataStr =
            'data:text/json;charset=utf-8,' +
            encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute(
            'download',
            `audit_logs_${new Date().toISOString().slice(0, 10)}.json`
        );
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    return (
        <div className="space-y-6">
            {/* Tiêu đề & Nút thao tác đầu trang */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t('menu.auditLog')} (IP Geolocation Gateway)
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Giám sát toàn bộ nhật ký truy cập, bảo mật IT và hành động thay đổi dữ liệu
                        kết nối API Geolocation.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={handleRefresh}
                        className="flex items-center gap-2"
                        isDisabled={isRefreshing}
                    >
                        <ArrowPathIcon
                            className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                        <span>Làm mới</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleExportJson}
                        className="flex items-center gap-2"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span>Xuất tệp JSON</span>
                    </Button>
                </div>
            </div>

            {/* Banner giám sát an ninh mạng */}
            <Alert status="accent">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <ShieldCheckIcon className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                        <span>
                            Hệ thống tích hợp giám sát IP Geolocation và tự động nhận diện thiết bị
                            truy cập bất thường.
                        </span>
                    </div>
                    <Badge variant="primary" color="accent">
                        Đang bảo vệ 24/7
                    </Badge>
                </div>
            </Alert>

            {/* Thẻ thống kê nhanh */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                Tổng sự kiện ghi nhận
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.total}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            <ClockIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                        Ghi nhận từ các phân hệ trong phiên
                    </p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                Thao tác an toàn
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.successes}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <CheckCircleIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">Được xác thực danh tính hợp lệ</p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-rose-600 uppercase dark:text-rose-400">
                                Cảnh báo / Thất bại
                            </p>
                            <p className="mt-1 text-2xl font-bold text-rose-600 dark:text-rose-400">
                                {stats.dangers}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                            <XCircleIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-3 text-xs font-medium text-rose-500">
                        1 lượt brute-force bị chặn IP
                    </p>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                                Chỉ số an toàn hệ thống
                            </p>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.safetyScore}%
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                            <ShieldCheckIcon className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="mt-3">
                        <ProgressBar value={stats.safetyScore} color="accent" size="sm" />
                    </div>
                </Card>
            </div>

            {/* Bộ lọc và tìm kiếm */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Tìm IP, tên nhân viên, hành động..."
                            value={searchTerm}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Phân hệ:
                        </span>
                        {['all', 'Auth', 'Finance', 'System', 'HR', 'Sales'].map((mod) => (
                            <button
                                key={mod}
                                type="button"
                                onClick={() => setSelectedModule(mod)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                    selectedModule === mod
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
                                }`}
                            >
                                {mod === 'all' ? 'Tất cả' : mod}
                            </button>
                        ))}
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
                                <SelectItem id="success" textValue="Thành công">
                                    Thành công
                                </SelectItem>
                                <SelectItem id="warning" textValue="Cảnh báo">
                                    Cảnh báo
                                </SelectItem>
                                <SelectItem id="danger" textValue="Nguy hiểm / Bị chặn">
                                    Nguy hiểm / Bị chặn
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Bảng dữ liệu Audit Logs */}
            <Card className="overflow-hidden">
                {isLoading ? (
                    <div className="space-y-4 p-6">
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                    </div>
                ) : (
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Bảng nhật ký hệ thống">
                                <Table.Header>
                                    <Table.Column isRowHeader>Mã log / Thời gian</Table.Column>
                                    <Table.Column>Người dùng</Table.Column>
                                    <Table.Column>Hành động / Phân hệ</Table.Column>
                                    <Table.Column>Địa chỉ IP & Vị trí</Table.Column>
                                    <Table.Column>Trạng thái</Table.Column>
                                    <Table.Column className="text-right">Chi tiết</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {filteredLogs.map((item) => (
                                        <Table.Row
                                            key={item.id}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <Table.Cell>
                                                <div>
                                                    <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">
                                                        {item.id}
                                                    </span>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {item.timestamp}
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-2.5">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                                        <UserIcon className="h-4 w-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                                                            {item.userName}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {item.role}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div>
                                                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                                                        {item.action}
                                                    </p>
                                                    <span className="mt-1 inline-block rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 dark:bg-zinc-800 dark:text-gray-300">
                                                        Phân hệ: {item.module}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div>
                                                    <span className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                                                        {item.ipAddress}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                        <GlobeAltIcon className="h-3 w-3 shrink-0 text-blue-500" />
                                                        <span className="max-w-50 truncate">
                                                            {item.location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {item.status === 'success' && (
                                                    <Chip color="success" variant="soft" size="sm">
                                                        Thành công
                                                    </Chip>
                                                )}
                                                {item.status === 'warning' && (
                                                    <Chip color="warning" variant="soft" size="sm">
                                                        Cần chú ý
                                                    </Chip>
                                                )}
                                                {item.status === 'danger' && (
                                                    <Chip color="danger" variant="soft" size="sm">
                                                        Bị chặn / Thất bại
                                                    </Chip>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleViewDetail(item)}
                                                    className="inline-flex items-center gap-1"
                                                >
                                                    <EyeIcon className="h-3.5 w-3.5" />
                                                    <span>Xem</span>
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                )}
            </Card>

            {/* Modal xem chi tiết sự kiện nhật ký */}
            <Modal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title="Chi tiết sự kiện nhật ký hệ thống"
                size="lg"
            >
                {activeLog && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-zinc-800/60">
                            <div>
                                <span className="text-xs text-gray-500">Mã sự kiện:</span>
                                <p className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                    {activeLog.id}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Thời gian ghi nhận:</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {activeLog.timestamp}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Người thực hiện:</span>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {activeLog.userName} ({activeLog.userEmail})
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Vai trò / Quyền hạn:</span>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {activeLog.role}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">Địa chỉ IP:</span>
                                <p className="font-mono text-sm text-blue-600 dark:text-blue-400">
                                    {activeLog.ipAddress}
                                </p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500">
                                    Vị trí địa lý (IP Geolocation):
                                </span>
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {activeLog.location}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Thiết bị & Trình duyệt (User Agent):
                            </span>
                            <p className="mt-1 rounded-lg border border-gray-200 bg-white p-2.5 font-mono text-xs text-gray-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-200">
                                {activeLog.device}
                            </p>
                        </div>

                        <div>
                            <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Nội dung chi tiết thao tác:
                            </span>
                            <div className="mt-1 rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300">
                                {activeLog.details}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="secondary" onClick={() => setIsDetailOpen(false)}>
                                Đóng
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
