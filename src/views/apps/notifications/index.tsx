'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import {
    Card,
    Button,
    Chip,
    Badge,
    Alert,
    Skeleton,
} from '@/components/common';
import {
    BellIcon,
    CheckCircleIcon,
    TrashIcon,
    ShoppingCartIcon,
    ShieldExclamationIcon,
    CurrencyDollarIcon,
    SparklesIcon,
    CheckIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { NotificationService } from '@/services';
import type { NotificationItem } from '@/types';

export function NotificationsPage() {
    const t = useTranslations();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await NotificationService.getNotifications({
                category: filterCategory === 'all' ? undefined : filterCategory,
                isRead: filterUnreadOnly ? false : undefined,
            });
            if (res.data) {
                setNotifications(res.data);
            }
        } catch {
            setNotifications([]);
        } finally {
            setIsLoading(false);
        }
    }, [filterCategory, filterUnreadOnly]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const unreadCount = useMemo(() => {
        return notifications.filter((n) => !n.isRead).length;
    }, [notifications]);

    const handleMarkAllAsRead = async () => {
        try {
            const res = await NotificationService.markAllAsRead();
            if (res.data) {
                setNotifications(res.data);
            }
        } catch {
            // fallback UI update
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await NotificationService.markAsRead(id);
            if (res.data) {
                setNotifications(res.data);
            }
        } catch {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
            );
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await NotificationService.deleteNotification(id);
            if (res.data) {
                setNotifications(res.data);
            }
        } catch {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'sales':
                return <ShoppingCartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
            case 'finance':
                return <CurrencyDollarIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
            case 'system':
                return <ShieldExclamationIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
            default:
                return <BellIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {t('menu.notifications')}
                        </h1>
                        {unreadCount > 0 && (
                            <Badge variant="primary" color="danger">
                                {unreadCount} mới
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cập nhật các biến động đơn hàng, an ninh hệ thống và công việc cần xử lý ngay qua NotificationService.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={fetchNotifications}
                        disabled={isLoading}
                        className="flex items-center gap-1.5"
                    >
                        <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Làm mới</span>
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        isDisabled={unreadCount === 0 || isLoading}
                        className="flex items-center gap-1.5"
                    >
                        <CheckCircleIcon className="h-4 w-4" />
                        <span>Đọc tất cả</span>
                    </Button>
                </div>
            </div>

            {/* Banner trạng thái */}
            <Alert status="accent">
                <div className="flex items-center gap-2 text-sm">
                    <SparklesIcon className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                    <span>
                        Trung tâm thông báo kết nối thời gian thực với RESTful Gateway hệ thống và bảo mật IT.
                    </span>
                </div>
            </Alert>

            {/* Bộ lọc thông báo */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'all', label: 'Tất cả' },
                            { id: 'sales', label: 'Bán hàng' },
                            { id: 'finance', label: 'Tài chính' },
                            { id: 'system', label: 'Bảo mật & IT' },
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setFilterCategory(cat.id)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    filterCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={filterUnreadOnly}
                                onChange={(e) => setFilterUnreadOnly(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>Chỉ hiện tin chưa đọc</span>
                        </label>
                    </div>
                </div>
            </Card>

            {/* Danh sách thông báo */}
            <div className="space-y-3">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                        <Card key={`notif-skel-${idx}`} className="p-4">
                            <div className="flex items-start gap-3">
                                <Skeleton className="h-9 w-9 rounded-xl" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-3 w-3/4" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : notifications.length > 0 ? (
                    notifications.map((item) => (
                        <Card
                            key={item.id}
                            className={`p-4 transition-all hover:shadow-md ${
                                !item.isRead
                                    ? 'border-l-4 border-l-blue-600 bg-blue-50/20 dark:bg-blue-950/10'
                                    : 'opacity-90'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 dark:bg-zinc-800 flex-shrink-0">
                                        {getCategoryIcon(item.category)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                                {item.title}
                                            </h3>
                                            {!item.isRead && (
                                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                                            )}
                                            {item.priority === 'high' && (
                                                <Chip color="danger" variant="soft" size="sm">Ưu tiên</Chip>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-300">
                                            {item.description}
                                        </p>
                                        <p className="text-[11px] text-gray-400">
                                            {item.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {!item.isRead && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => handleMarkAsRead(item.id)}
                                            className="inline-flex items-center gap-1"
                                        >
                                            <CheckIcon className="h-3.5 w-3.5" />
                                            <span>Đã đọc</span>
                                        </Button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(item.id)}
                                        className="rounded p-1 text-gray-400 hover:text-rose-500 transition-colors"
                                        title="Xóa thông báo"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-12 text-center text-sm text-gray-500">
                        Không có thông báo nào phù hợp với bộ lọc hiện tại.
                    </Card>
                )}
            </div>
        </div>
    );
}
