import { ComponentType, ReactNode, isValidElement } from 'react';
import { CircleStackIcon } from '@heroicons/react/24/outline';

export interface EmptyStateProps {
    /** Icon hiển thị chính giữa: có thể truyền component SVG Icon hoặc ReactNode */
    icon?: ComponentType<{ className?: string }> | ReactNode;
    /** Tiêu đề chính của trạng thái trống */
    title?: ReactNode;
    /** Mô tả hoặc gợi ý hành động */
    description?: ReactNode;
    /** Nút bấm hoặc hành động phụ (ví dụ: nút Xóa bộ lọc, Làm mới, Thêm mới) */
    action?: ReactNode;
    /** Custom class cho container */
    className?: string;
}

/**
 * Component hiển thị trạng thái trống (Empty State) dùng chung
 * Chuẩn hóa trải nghiệm cho Table.Body renderEmptyState và các màn hình danh sách khi không có dữ liệu
 */
export function EmptyState({
    icon,
    title = 'Không tìm thấy dữ liệu',
    description,
    action,
    className = '',
}: Readonly<EmptyStateProps>) {
    const renderIcon = () => {
        if (!icon) {
            return <CircleStackIcon className="text-muted h-10 w-10 stroke-[1.5]" />;
        }
        if (isValidElement(icon)) {
            return icon;
        }
        const IconComponent = icon as ComponentType<{ className?: string }>;
        return <IconComponent className="text-muted h-10 w-10 stroke-[1.5]" />;
    };

    return (
        <div
            className={`flex h-48 w-full flex-col items-center justify-center gap-3 py-10 text-center ${className}`}
        >
            <div className="flex items-center justify-center">{renderIcon()}</div>
            <div className="space-y-1">
                {typeof title === 'string' ? (
                    <p className="text-foreground text-sm font-semibold">{title}</p>
                ) : (
                    title
                )}
                {description && (
                    typeof description === 'string' ? (
                        <p className="text-muted max-w-sm text-xs">{description}</p>
                    ) : (
                        description
                    )
                )}
            </div>
            {action && <div className="mt-1">{action}</div>}
        </div>
    );
}
