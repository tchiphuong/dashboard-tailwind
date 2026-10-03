'use client';

import { useState, useEffect, useMemo, useCallback, type ChangeEvent } from 'react';
import { Breadcrumb } from '@/components/layout';
import {
    Card,
    Button,
    Table,
    Chip,
    Input,
    Select,
    SelectItem,
    Skeleton,
} from '@/components/common';
import {
    ComputerDesktopIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { AssetService } from '@/services';
import type { AssetItem, AssetRequestItem } from '@/types';

export function AssetsList() {
    const [assets, setAssets] = useState<AssetItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    const fetchAssets = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await AssetService.getAssets({
                pageSize: 20,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                search: searchTerm.trim() || undefined,
            });
            if (res.data?.items) {
                setAssets(res.data.items);
            } else if (Array.isArray(res.data)) {
                setAssets(res.data);
            }
        } catch {
            setAssets([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedStatus, searchTerm]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const filteredAssets = useMemo(() => {
        return assets.filter((a) => {
            const matchesSearch =
                a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
    }, [assets, searchTerm, selectedStatus]);

    const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[{ label: 'Quản lý tài sản', href: '#' }, { label: 'Danh mục thiết bị' }]}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Quản lý Tài sản Doanh nghiệp
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Theo dõi vòng đời trang thiết bị, tình trạng cấp phát và giá trị khấu hao
                        tài sản từ Public API Gateway.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={fetchAssets}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Làm mới dữ liệu</span>
                </Button>
            </div>

            {/* Thống kê tài sản */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
                        Tổng số trang thiết bị
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? '...' : assets.length}
                    </p>
                </Card>
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-blue-600 uppercase dark:text-blue-400">
                        Đang sử dụng
                    </p>
                    <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {isLoading ? '...' : assets.filter((a) => a.status === 'in_use').length}
                    </p>
                </Card>
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                        Sẵn sàng cấp phát
                    </p>
                    <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {isLoading ? '...' : assets.filter((a) => a.status === 'available').length}
                    </p>
                </Card>
                <Card className="p-5">
                    <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-400">
                        Tổng giá trị tài sản
                    </p>
                    <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {isLoading
                            ? '...'
                            : formatVND(assets.reduce((acc, a) => acc + (a.value || 0), 0))}
                    </p>
                </Card>
            </div>

            {/* Bộ lọc tìm kiếm */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:w-80">
                        <Input
                            placeholder="Tìm thiết bị, mã tài sản, người nhận..."
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
                                <SelectItem id="in_use" textValue="Đang sử dụng">
                                    Đang sử dụng
                                </SelectItem>
                                <SelectItem id="available" textValue="Sẵn sàng cấp">
                                    Sẵn sàng cấp
                                </SelectItem>
                                <SelectItem id="maintenance" textValue="Đang bảo trì">
                                    Đang bảo trì
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Bảng danh sách thiết bị */}
            <Card className="overflow-hidden p-0">
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Bảng tài sản">
                            <Table.Header>
                                <Table.Column isRowHeader>Thiết bị & Mã định danh</Table.Column>
                                <Table.Column>Chuyên mục</Table.Column>
                                <Table.Column>Người sử dụng / Phòng ban</Table.Column>
                                <Table.Column>Giá trị nguyên giá</Table.Column>
                                <Table.Column className="text-right">Tình trạng</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {isLoading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <Table.Row key={`skeleton-${index}`}>
                                            <Table.Cell>
                                                <div className="flex items-center gap-2.5">
                                                    <Skeleton className="h-8 w-8 rounded" />
                                                    <div className="space-y-1">
                                                        <Skeleton className="h-4 w-40" />
                                                        <Skeleton className="h-3 w-20" />
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-20" />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-28" />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-24" />
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <Skeleton className="ml-auto h-6 w-16" />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : filteredAssets.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell
                                            className="py-8 text-center text-gray-500"
                                            colSpan={5}
                                        >
                                            Không tìm thấy trang thiết bị nào phù hợp với bộ lọc.
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    filteredAssets.map((ast) => (
                                        <Table.Row
                                            key={String(ast.id)}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <Table.Cell>
                                                <div className="flex max-w-sm items-start gap-2.5">
                                                    <ComputerDesktopIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                            {ast.name}
                                                        </p>
                                                        <p className="font-mono text-[10px] text-gray-400">
                                                            {ast.code}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                                                    {ast.category}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="text-xs">
                                                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                                                        {ast.assignedTo}
                                                    </p>
                                                    <p className="text-gray-400">
                                                        {ast.department}
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono text-xs font-medium text-gray-800 dark:text-gray-200">
                                                    {formatVND(ast.value)}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                {ast.status === 'in_use' && (
                                                    <Chip color="success" variant="soft" size="sm">
                                                        Đang dùng
                                                    </Chip>
                                                )}
                                                {ast.status === 'available' && (
                                                    <Chip color="accent" variant="soft" size="sm">
                                                        Sẵn sàng
                                                    </Chip>
                                                )}
                                                {ast.status === 'maintenance' && (
                                                    <Chip color="warning" variant="soft" size="sm">
                                                        Bảo trì
                                                    </Chip>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card>
        </div>
    );
}

export function AssetsRequests() {
    const [requests, setRequests] = useState<AssetRequestItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await AssetService.getRequests();
            if (res.data) {
                setRequests(res.data);
            }
        } catch {
            setRequests([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleApprove = async (id: string) => {
        setProcessingId(id);
        try {
            await AssetService.updateRequestStatus(id, 'approved');
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r))
            );
        } catch {
            // Xử lý lỗi nếu có
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id: string) => {
        setProcessingId(id);
        try {
            await AssetService.updateRequestStatus(id, 'rejected');
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: 'rejected' } : r))
            );
        } catch {
            // Xử lý lỗi nếu có
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[{ label: 'Quản lý tài sản', href: '#' }, { label: 'Yêu cầu cấp phát' }]}
            />

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Yêu cầu Cấp phát & Bổ sung Thiết bị
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Phê duyệt các đề xuất cấp máy tính, phụ kiện làm việc từ các phòng ban qua
                        Service.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={fetchRequests}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Tải lại</span>
                </Button>
            </div>

            <Card className="overflow-hidden p-0">
                <Table variant="secondary">
                    <Table.ScrollContainer>
                        <Table.Content aria-label="Bảng đề xuất cấp tài sản">
                            <Table.Header>
                                <Table.Column isRowHeader>Nhân viên đề xuất</Table.Column>
                                <Table.Column>Thiết bị xin cấp</Table.Column>
                                <Table.Column>Lý do & Nhu cầu</Table.Column>
                                <Table.Column>Ngày gửi</Table.Column>
                                <Table.Column>Trạng thái</Table.Column>
                                <Table.Column className="text-right">Phê duyệt</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {isLoading ? (
                                    Array.from({ length: 3 }).map((_, index) => (
                                        <Table.Row key={`req-skel-${index}`}>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-28" />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-36" />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-48" />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-4 w-20" />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Skeleton className="h-6 w-16" />
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <Skeleton className="ml-auto h-8 w-24" />
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : requests.length === 0 ? (
                                    <Table.Row>
                                        <Table.Cell
                                            className="py-8 text-center text-gray-500"
                                            colSpan={6}
                                        >
                                            Hiện không có yêu cầu cấp phát nào.
                                        </Table.Cell>
                                    </Table.Row>
                                ) : (
                                    requests.map((req) => (
                                        <Table.Row
                                            key={req.id}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <Table.Cell>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                                                        {req.requesterName}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400">
                                                        {req.department}
                                                    </p>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                                    {req.assetType}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <p className="max-w-xs text-xs text-gray-600 dark:text-gray-300">
                                                    {req.reason}
                                                </p>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono text-xs text-gray-500">
                                                    {req.requestDate}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {req.status === 'approved' && (
                                                    <Chip color="success" variant="soft" size="sm">
                                                        Đã duyệt
                                                    </Chip>
                                                )}
                                                {req.status === 'pending' && (
                                                    <Chip color="warning" variant="soft" size="sm">
                                                        Chờ duyệt
                                                    </Chip>
                                                )}
                                                {req.status === 'rejected' && (
                                                    <Chip color="danger" variant="soft" size="sm">
                                                        Từ chối
                                                    </Chip>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                {req.status === 'pending' ? (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="primary"
                                                            disabled={processingId === req.id}
                                                            onClick={() => handleApprove(req.id)}
                                                            className="inline-flex items-center gap-1"
                                                        >
                                                            <CheckCircleIcon className="h-3.5 w-3.5" />
                                                            <span>Duyệt</span>
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            disabled={processingId === req.id}
                                                            onClick={() => handleReject(req.id)}
                                                            className="inline-flex items-center gap-1 text-rose-600"
                                                        >
                                                            <XCircleIcon className="h-3.5 w-3.5" />
                                                            <span>Từ chối</span>
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400">
                                                        Đã xử lý
                                                    </span>
                                                )}
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card>
        </div>
    );
}
