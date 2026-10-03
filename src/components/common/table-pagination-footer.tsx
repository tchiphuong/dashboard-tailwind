import { Table as BaseTable, Pagination } from '@heroui/react';
import { Select, SelectItem } from './select';

export interface TablePaginationFooterProps {
    /** Trang hiện tại (1-indexed) */
    page: number;
    /** Số bản ghi trên mỗi trang */
    pageSize: number;
    /** Tổng số bản ghi dữ liệu */
    totalItems: number;
    /** Tổng số trang */
    totalPages: number;
    /** Hàm xử lý khi người dùng đổi trang */
    onPageChange: (page: number) => void;
    /** Hàm xử lý khi người dùng đổi số bản ghi / trang */
    onPageSizeChange?: (pageSize: number) => void;
    /** Danh sách tùy chọn số bản ghi / trang (mặc định [5, 10, 20, 50]) */
    pageSizeOptions?: number[];
    /** Danh từ mô tả đối tượng bản ghi (mặc định: "bản ghi") */
    itemName?: string;
    /** Custom class cho Table.Footer */
    className?: string;
}

/**
 * Helper sinh danh sách các nút chuyển trang kèm dấu ba chấm (Ellipsis)
 */
function generatePageItems(
    page: number,
    totalPages: number,
    onPageChange: (p: number) => void
) {
    if (totalPages <= 1) return null;

    const pages: (number | 'ellipsis-left' | 'ellipsis-right')[] = [];

    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        if (page > 3) {
            pages.push('ellipsis-left');
        }

        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (page < totalPages - 2) {
            pages.push('ellipsis-right');
        }
        pages.push(totalPages);
    }

    return pages.map((p) => {
        if (p === 'ellipsis-left' || p === 'ellipsis-right') {
            return (
                <Pagination.Item key={`ellipsis-${p}`}>
                    <Pagination.Ellipsis />
                </Pagination.Item>
            );
        }
        return (
            <Pagination.Item key={`page-${p}`}>
                <Pagination.Link isActive={p === page} onPress={() => onPageChange(p)}>
                    {p}
                </Pagination.Link>
            </Pagination.Item>
        );
    });
}

/**
 * Component thanh phân trang đáy bảng chuẩn 3 khối theo quy chuẩn HeroUI v3 Compound
 * Tầng 5 - Standard Pagination Bar:
 * - Khối trái: Chọn số lượng bản ghi / trang (Select size="sm")
 * - Khối giữa: Thống kê số lượng hiển thị (Pagination.Summary với tabular-nums)
 * - Khối phải: Bộ điều khiển chuyển trang (Pagination.Content)
 */
export function TablePaginationFooter({
    page,
    pageSize,
    totalItems,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    itemName = 'bản ghi',
    className = '',
}: Readonly<TablePaginationFooterProps>) {
    const startItem = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
    const endItem = Math.min(page * pageSize, totalItems);

    const handleSelectSize = (key: unknown) => {
        if (!key || !onPageSizeChange) return;
        const firstKey =
            typeof key === 'object' && Symbol.iterator in (key as object)
                ? Array.from(key as Iterable<unknown>)[0]
                : key;
        if (firstKey) {
            onPageSizeChange(Number(firstKey));
        }
    };

    return (
        <BaseTable.Footer className={`border-separator border-t p-4 ${className}`}>
            <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
                {/* 1. Bên trái: Chọn số item / trang */}
                <div className="flex w-full items-center justify-start gap-2 sm:w-auto">
                    <span className="text-muted text-xs">Hiển thị:</span>
                    <div className="w-28">
                        <Select
                            size="sm"
                            selectedKey={String(pageSize)}
                            onSelectionChange={handleSelectSize}
                            isDisabled={!onPageSizeChange}
                        >
                            {pageSizeOptions.map((opt) => (
                                <SelectItem
                                    key={String(opt)}
                                    id={String(opt)}
                                    textValue={`${opt} / trang`}
                                >
                                    {opt} / trang
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                {/* 2. Ở giữa: Hiển thị thông tin số item bằng Pagination.Summary */}
                <div className="text-center">
                    <Pagination.Summary className="text-muted text-xs tabular-nums">
                        Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trên tổng
                        số <strong>{totalItems}</strong> {itemName}
                    </Pagination.Summary>
                </div>

                {/* 3. Bên phải: Chọn trang */}
                <div className="flex w-full justify-center sm:w-auto sm:justify-end">
                    <Pagination size="sm" className="justify-center sm:justify-end">
                        <Pagination.Content>
                            <Pagination.Item>
                                <Pagination.Previous
                                    isDisabled={page <= 1}
                                    onPress={() => onPageChange(Math.max(1, page - 1))}
                                >
                                    <Pagination.PreviousIcon />
                                    <span>Trước</span>
                                </Pagination.Previous>
                            </Pagination.Item>
                            {generatePageItems(page, totalPages, onPageChange)}
                            <Pagination.Item>
                                <Pagination.Next
                                    isDisabled={page >= totalPages}
                                    onPress={() => onPageChange(Math.min(totalPages, page + 1))}
                                >
                                    <span>Sau</span>
                                    <Pagination.NextIcon />
                                </Pagination.Next>
                            </Pagination.Item>
                        </Pagination.Content>
                    </Pagination>
                </div>
            </div>
        </BaseTable.Footer>
    );
}
