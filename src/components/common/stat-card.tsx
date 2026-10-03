import { ComponentType, ReactNode } from 'react';
import { Card } from './card';

export type StatCardVariant =
    | 'default'
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'thirdary'
    | 'quaternary'
    | 'fourth'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger';

export interface StatCardProps {
    /** Tiêu đề / Nhãn của chỉ số (ví dụ: Tổng số dự án, Doanh thu) */
    label: ReactNode;
    /** Giá trị số liệu (chuỗi hoặc số, tự động căn số tabular-nums) */
    value: ReactNode;
    /** Màu viền đáy nhận diện phong cách Dashboard Pastel */
    variant?: StatCardVariant;
    /** Trạng thái đang tải dữ liệu */
    isLoading?: boolean;
    /** Icon minh họa (Component SVG hoặc ReactNode) */
    icon?: ComponentType<{ className?: string }> | ReactNode;
    /** Ghi chú phụ hoặc mô tả ngắn bên dưới số liệu */
    description?: ReactNode;
    /** Tùy biến class container */
    className?: string;
}

const variantStyles: Record<
    StatCardVariant,
    { borderClass: string; labelClass: string; valueClass: string }
> = {
    default: {
        borderClass: 'border-zinc-300 dark:border-zinc-700',
        labelClass: 'text-zinc-500 dark:text-zinc-400',
        valueClass: 'text-zinc-900 dark:text-zinc-50',
    },
    primary: {
        borderClass: 'border-blue-500 dark:border-blue-500',
        labelClass: 'text-blue-600 dark:text-blue-400',
        valueClass: 'text-blue-600 dark:text-blue-400',
    },
    secondary: {
        borderClass: 'border-purple-500 dark:border-purple-500',
        labelClass: 'text-purple-600 dark:text-purple-400',
        valueClass: 'text-purple-600 dark:text-purple-400',
    },
    tertiary: {
        borderClass: 'border-emerald-500 dark:border-emerald-500',
        labelClass: 'text-emerald-600 dark:text-emerald-400',
        valueClass: 'text-emerald-600 dark:text-emerald-400',
    },
    thirdary: {
        borderClass: 'border-emerald-500 dark:border-emerald-500',
        labelClass: 'text-emerald-600 dark:text-emerald-400',
        valueClass: 'text-emerald-600 dark:text-emerald-400',
    },
    quaternary: {
        borderClass: 'border-amber-500 dark:border-amber-500',
        labelClass: 'text-amber-600 dark:text-amber-400',
        valueClass: 'text-amber-600 dark:text-amber-400',
    },
    fourth: {
        borderClass: 'border-amber-500 dark:border-amber-500',
        labelClass: 'text-amber-600 dark:text-amber-400',
        valueClass: 'text-amber-600 dark:text-amber-400',
    },
    accent: {
        borderClass: 'border-indigo-500 dark:border-indigo-500',
        labelClass: 'text-indigo-600 dark:text-indigo-400',
        valueClass: 'text-indigo-600 dark:text-indigo-400',
    },
    success: {
        borderClass: 'border-emerald-500 dark:border-emerald-500',
        labelClass: 'text-emerald-600 dark:text-emerald-400',
        valueClass: 'text-emerald-600 dark:text-emerald-400',
    },
    warning: {
        borderClass: 'border-amber-500 dark:border-amber-500',
        labelClass: 'text-amber-600 dark:text-amber-400',
        valueClass: 'text-amber-600 dark:text-amber-400',
    },
    danger: {
        borderClass: 'border-rose-500 dark:border-rose-500',
        labelClass: 'text-rose-600 dark:text-rose-400',
        valueClass: 'text-rose-600 dark:text-rose-400',
    },
};

/**
 * Thẻ thống kê KPI nhanh (Quick Stats Card)
 * Chuẩn hóa Tầng 2 theo tài liệu AGENTS.md:
 * - Card phong cách Dashboard: border 1 và border-b-4 màu nhận diện chuẩn
 * - Bắt buộc áp dụng tabular-nums cho toàn bộ số liệu
 */
export function StatCard({
    label,
    value,
    variant = 'default',
    isLoading = false,
    icon,
    description,
    className = '',
}: Readonly<StatCardProps>) {
    const style = variantStyles[variant] || variantStyles.default;

    const renderIcon = () => {
        if (!icon) return null;
        if (typeof icon === 'function') {
            const IconComponent = icon as ComponentType<{ className?: string }>;
            return <IconComponent className="h-5 w-5" />;
        }
        return icon;
    };

    return (
        <Card
            className={`group relative overflow-hidden border border-b-4 ${style.borderClass} p-5 shadow-xs transition-all duration-300 hover:shadow-md ${className}`}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p
                        className={`text-xs font-semibold tracking-wider uppercase ${style.labelClass}`}
                    >
                        {label}
                    </p>
                    <p className={`text-2xl font-bold tabular-nums ${style.valueClass}`}>
                        {isLoading ? '...' : value}
                    </p>
                    {description && <p className="text-muted text-xs">{description}</p>}
                </div>
                {icon && (
                    <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${style.labelClass}`}
                    >
                        {renderIcon()}
                    </span>
                )}
            </div>
        </Card>
    );
}
