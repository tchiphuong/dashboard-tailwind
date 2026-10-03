'use client';

import { toast } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

export { Toast, toast, ToastProvider } from '@heroui/react';

export type AppToastOptions = Parameters<typeof toast>[1];

export type ToastOptions = NonNullable<AppToastOptions> & {
    title?: string;
    [key: string]: unknown;
};

export interface AddToastProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    timeout?: number;
    [key: string]: unknown;
}

/**
 * Hàm tương thích ngược addToast chuẩn hóa cho HeroUI v3
 */
export function addToast({
    title,
    description,
    color,
    timeout,
    ...options
}: AddToastProps): string {
    const toastOpts: AppToastOptions = {
        description,
        timeout,
        ...options,
    };
    switch (color) {
        case 'success':
            return toast.success(title, toastOpts);
        case 'danger':
            return toast.danger(title, toastOpts);
        case 'warning':
            return toast.warning(title, toastOpts);
        case 'primary':
        case 'secondary':
            return toast.info(title, toastOpts);
        default:
            return toast(title, toastOpts);
    }
}

/**
 * Thông báo tải dữ liệu thành công chuẩn hóa hệ thống
 * @param entityName Tên đối tượng dữ liệu (ví dụ: "dự án", "người dùng", "sản phẩm")
 * @param count Số lượng bản ghi vừa tải (tùy chọn)
 */
export function notifyFetchSuccess(entityName: string, count?: number): string {
    const desc =
        count !== undefined
            ? `Đã tải ${count} ${entityName}`
            : `Dữ liệu ${entityName} đã được cập nhật mới nhất`;
    return toast.success(`Dữ liệu ${entityName}`, {
        description: desc,
    });
}

/**
 * Thông báo tải dữ liệu thất bại chuẩn hóa hệ thống
 * @param entityName Tên đối tượng dữ liệu (ví dụ: "dự án", "người dùng", "sản phẩm")
 * @param message Thông điệp lỗi chi tiết (tùy chọn)
 */
export function notifyFetchError(entityName: string, message?: string): string {
    return toast.danger(`Lỗi tải dữ liệu`, {
        description:
            message || `Không thể kết nối đến máy chủ ${entityName}. Vui lòng thử lại sau.`,
    });
}

/** Alias tương thích */
export const notifyDataSuccess = notifyFetchSuccess;
export const notifyDataError = notifyFetchError;

/**
 * Thông báo thêm mới thành công chuẩn hóa hệ thống
 * @param entityName Tên đối tượng (ví dụ: "dự án", "người dùng")
 * @param detail Tên/Mã đối tượng cụ thể (tùy chọn)
 */
export function notifyCreateSuccess(entityName: string, detail?: string): string {
    const desc = detail
        ? `${entityName} "${detail}" đã được khởi tạo thành công.`
        : `Đã thêm mới ${entityName} vào hệ thống thành công.`;
    return toast.success(`Thêm mới ${entityName} thành công`, {
        description: desc,
    });
}

/**
 * Thông báo thêm mới thất bại chuẩn hóa hệ thống
 * @param entityName Tên đối tượng (ví dụ: "dự án", "người dùng")
 * @param message Thông điệp lỗi chi tiết (tùy chọn)
 */
export function notifyCreateError(entityName: string, message?: string): string {
    return toast.danger(`Thêm mới ${entityName} thất bại`, {
        description:
            message || `Không thể khởi tạo ${entityName}. Vui lòng kiểm tra lại thông tin.`,
    });
}

/**
 * Thông báo cập nhật thành công chuẩn hóa hệ thống
 * @param entityName Tên đối tượng (ví dụ: "dự án", "người dùng")
 * @param detail Tên/Mã đối tượng cụ thể (tùy chọn)
 */
export function notifyUpdateSuccess(entityName: string, detail?: string): string {
    const desc = detail
        ? `Thông tin ${entityName} "${detail}" đã được cập nhật.`
        : `Cập nhật dữ liệu ${entityName} thành công.`;
    return toast.success(`Cập nhật ${entityName} thành công`, {
        description: desc,
    });
}

/**
 * Thông báo cập nhật thất bại chuẩn hóa hệ thống
 * @param entityName Tên đối tượng (ví dụ: "dự án", "người dùng")
 * @param message Thông điệp lỗi chi tiết (tùy chọn)
 */
export function notifyUpdateError(entityName: string, message?: string): string {
    return toast.danger(`Cập nhật ${entityName} thất bại`, {
        description: message || `Không thể lưu thay đổi của ${entityName}. Vui lòng thử lại sau.`,
    });
}

/**
 * Thông báo xóa thành công chuẩn hóa hệ thống
 * @param entityName Tên đối tượng (ví dụ: "dự án", "người dùng")
 * @param detail Tên/Mã đối tượng cụ thể (tùy chọn)
 */
export function notifyDeleteSuccess(entityName: string, detail?: string): string {
    const desc = detail
        ? `${entityName} "${detail}" đã được xóa khỏi hệ thống.`
        : `Đã xóa ${entityName} thành công.`;
    return toast.success(`Xóa ${entityName} thành công`, {
        description: desc,
    });
}

/**
 * Thông báo xóa thất bại chuẩn hóa hệ thống
 * @param entityName Tên đối tượng (ví dụ: "dự án", "người dùng")
 * @param message Thông điệp lỗi chi tiết (tùy chọn)
 */
export function notifyDeleteError(entityName: string, message?: string): string {
    return toast.danger(`Xóa ${entityName} thất bại`, {
        description:
            message ||
            `Không thể xóa ${entityName}. Vui lòng kiểm tra lại quyền hạn hoặc ràng buộc dữ liệu.`,
    });
}

/**
 * Bộ helper thông báo CRUD tập trung cho toàn bộ hệ thống
 */
export const notify = {
    fetchSuccess: notifyFetchSuccess,
    fetchError: notifyFetchError,
    createSuccess: notifyCreateSuccess,
    createError: notifyCreateError,
    updateSuccess: notifyUpdateSuccess,
    updateError: notifyUpdateError,
    deleteSuccess: notifyDeleteSuccess,
    deleteError: notifyDeleteError,
};

export const useAppToast = () => {
    const t = useTranslations('common.error.msg');
    const tSuccess = useTranslations('common.success.msg');

    return useMemo(
        () => ({
            success: (title: string, message?: string, options?: ToastOptions) => {
                const desc = message || tSuccess('saved');
                return toast.success(title, {
                    description: desc,
                    ...options,
                });
            },

            error: (title: string, message?: string, options?: ToastOptions) => {
                const desc = message || t('general');
                return toast.danger(title, {
                    description: desc,
                    ...options,
                });
            },

            warning: (title: string, message?: string, options?: ToastOptions) => {
                const desc = message || t('general');
                return toast.warning(title, {
                    description: desc,
                    ...options,
                });
            },

            info: (title: string, message?: string, options?: ToastOptions) => {
                const desc = message || t('general');
                return toast.info(title, {
                    description: desc,
                    ...options,
                });
            },

            default: (message: string, options?: ToastOptions) => toast(message, options),

            clear: () => {
                toast.clear();
            },
        }),
        [t, tSuccess]
    );
};
