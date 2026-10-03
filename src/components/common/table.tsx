import React, { ReactNode, useCallback, useMemo } from 'react';
import {
    ArrowPathIcon,
    ChevronDownIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    Table as BaseTable,
    Button,
    Dropdown,
    Input,
    Label,
    Pagination,
    Skeleton,
    SortDescriptor,
    Spinner,
    Tooltip,
} from '@heroui/react';
import { EmptyState } from './empty-state';
import { TablePaginationFooter } from './table-pagination-footer';

export type { SortDescriptor } from '@heroui/react';

// ==================== TYPES ====================

// Column definition
export interface TableColumn<T> {
    key: string;
    label: string;
    width?: number;
    align?: 'start' | 'center' | 'end';
    sortable?: boolean;
    filterable?: boolean;
    filterType?: 'text' | 'select' | 'date' | 'number';
    filterOptions?: { key: string; label: string }[];
    render?: (item: T, index: number) => ReactNode;
}

// Action definition
export interface TableAction<T> {
    key: string;
    label: string;
    icon?: ReactNode;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    onClick: (item: T) => void;
    isVisible?: (item: T) => boolean;
    isDisabled?: (item: T) => boolean;
}

// Pagination info
export interface TablePagination {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    pageSizeOptions?: number[];
    onPageSizeChange?: (pageSize: number) => void;
}

// Sort info
export interface TableSort {
    column: string;
    direction: 'ascending' | 'descending';
}

// Filter value
export interface TableFilter {
    [key: string]: string | number | undefined;
}

export interface CommonTableProps<T extends object = Record<string, unknown>> {
    children?: ReactNode;
    variant?: 'primary' | 'secondary';
    className?: string;
    items?: T[];
    columns?: TableColumn<T>[];
    getRowKey?: (item: T) => string | number;

    // Optional features
    isLoading?: boolean;
    enableSkeleton?: boolean;
    skeletonRows?: number;
    emptyContent?: ReactNode;
    loadingContent?: ReactNode;

    // Pagination
    enablePagination?: boolean; // Cho phép on/off phân trang, mặc định true (default on)
    defaultPageSize?: number;
    pagination?: TablePagination;
    showPaginationInfo?: boolean;

    // Sorting
    sortDescriptor?: SortDescriptor;
    onSortChange?: (descriptor: SortDescriptor) => void;

    // Filtering
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    showFilters?: boolean;
    filters?: TableFilter;
    onFilterChange?: (filters: TableFilter) => void;

    // Column visibility
    visibleColumns?: Set<string> | 'all';
    onVisibleColumnsChange?: (columns: Set<string>) => void;
    showColumnToggle?: boolean;

    // Actions column
    actions?: TableAction<T>[];
    onRowAction?: (key: string | number) => void; // Allow row click
    actionsLabel?: string;
    actionsWidth?: number;

    // Toolbar
    toolbarContent?: ReactNode;
    showRefresh?: boolean;
    onRefresh?: () => void;

    // Styling
    isStriped?: boolean;
    isCompact?: boolean;
    selectionMode?: 'none' | 'single' | 'multiple';
    selectedKeys?: Iterable<string | number> | 'all';
    onSelectionChange?: (keys: 'all' | Set<string | number>) => void;

    // Custom top/bottom content
    topContent?: ReactNode;
    bottomContent?: ReactNode;

    // Layout & Scroll
    isHeaderSticky?: boolean;
    maxHeight?: string; // e.g. "400px" or "calc(100vh - 200px)"

    // Aria
    'aria-label'?: string;
}

// ==================== DEFAULT VALUES ====================

const defaultIcons: Record<string, ReactNode> = {
    view: <EyeIcon className="h-4 w-4 text-gray-500" />,
    edit: <PencilIcon className="h-4 w-4 text-blue-500" />,
    delete: <TrashIcon className="h-4 w-4 text-red-500" />,
};

// Quy chuẩn căn lề dữ liệu bảng: số canh phải, ngày canh giữa, text canh trái
function getColumnAlignmentClass(col?: { key?: string; label?: string; align?: string }) {
    if (!col) return 'text-left';
    if (col.align === 'end') return 'text-right';
    if (col.align === 'center') return 'text-center';
    if (col.align === 'start') return 'text-left';

    const keyLower = (col.key || '').toLowerCase();
    const labelLower = (col.label || '').toLowerCase();

    // 1. Ngày tháng / Thời gian / Deadline: Canh giữa
    if (
        keyLower.includes('date') ||
        keyLower.includes('time') ||
        keyLower.includes('createdat') ||
        keyLower.includes('updatedat') ||
        keyLower.includes('deadline') ||
        labelLower.includes('ngày') ||
        labelLower.includes('thời gian') ||
        labelLower.includes('thời hạn')
    ) {
        return 'text-center';
    }

    // 2. Số liệu / Tiền tệ / Ngân sách / Phần trăm / Số lượng: Canh phải
    if (
        keyLower.includes('amount') ||
        keyLower.includes('budget') ||
        keyLower.includes('price') ||
        keyLower.includes('total') ||
        keyLower.includes('cost') ||
        keyLower.includes('salary') ||
        keyLower.includes('spent') ||
        keyLower.includes('revenue') ||
        keyLower.includes('quantity') ||
        keyLower.includes('count') ||
        keyLower.includes('rate') ||
        keyLower.includes('percent') ||
        labelLower.includes('giá') ||
        labelLower.includes('ngân sách') ||
        labelLower.includes('số tiền') ||
        labelLower.includes('tổng tiền') ||
        labelLower.includes('doanh thu') ||
        labelLower.includes('chi phí') ||
        labelLower.includes('tỷ lệ') ||
        labelLower.includes('phần trăm')
    ) {
        return 'text-right';
    }

    // 3. Actions column: Canh phải
    if (col.key === '_actions') {
        return 'text-right';
    }

    // 4. Text / Thông tin danh mục: Mặc định canh trái
    return 'text-left';
}

function resolveRowKey<T>(
    item: T,
    index: number,
    getRowKey?: (item: T) => string | number
): string | number {
    const record = item as Record<string, unknown>;
    if (record._isSkeleton) {
        return String(record.id);
    }
    if (getRowKey) {
        return getRowKey(item);
    }
    return (record.id as string | number) ?? index;
}

// ==================== SUB-COMPONENTS ====================

export interface TableCompoundPaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    pageSizeOptions?: number[];
    onPageSizeChange?: (pageSize: number) => void;
    showPaginationInfo?: boolean;
    enablePagination?: boolean;
    className?: string;
}

export function TableCompoundPagination({
    page,
    pageSize,
    total,
    onPageChange,
    pageSizeOptions = [5, 10, 20, 50],
    onPageSizeChange,
    showPaginationInfo = true,
    enablePagination = true,
    className = '',
}: Readonly<TableCompoundPaginationProps>) {
    if (!enablePagination || total <= 0) return null;

    const totalPages = Math.ceil(total / pageSize);
    const startItem = Math.min((page - 1) * pageSize + 1, total);
    const endItem = Math.min(page * pageSize, total);

    return (
        <div
            className={`border-separator flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row ${className}`}
        >
            {/* 1. Bên trái: Chọn số item / trang */}
            <div className="flex w-full items-center justify-start gap-2 sm:w-auto">
                {onPageSizeChange && (
                    <>
                        <span className="text-muted text-xs">Hiển thị:</span>
                        <div className="w-28">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button variant="ghost" size="sm">
                                        {pageSize} / trang
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Popover>
                                    <Dropdown.Menu
                                        aria-label="Số dòng mỗi trang"
                                        selectionMode="single"
                                        selectedKeys={new Set([String(pageSize)])}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0];
                                            if (selected) {
                                                onPageSizeChange(Number(selected));
                                            }
                                        }}
                                    >
                                        {pageSizeOptions.map((size: number) => (
                                            <Dropdown.Item
                                                id={String(size)}
                                                key={String(size)}
                                                textValue={`${size} / trang`}
                                            >
                                                <Label>{size} / trang</Label>
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                    </>
                )}
            </div>

            {/* 2. Ở giữa: Hiển thị thông tin số item */}
            <div className="text-center">
                {showPaginationInfo && (
                    <span className="text-muted text-xs tabular-nums">
                        Hiển thị <strong>{startItem}</strong> - <strong>{endItem}</strong> trên tổng
                        số <strong>{total}</strong> dòng
                    </span>
                )}
            </div>

            {/* 3. Bên phải: Chọn trang */}
            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
                <Pagination size="sm" className="justify-center sm:justify-end">
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous
                                isDisabled={page <= 1}
                                onPress={() => onPageChange(page - 1)}
                            >
                                Trước
                            </Pagination.Previous>
                        </Pagination.Item>

                        {totalPages > 0 && (
                            <>
                                <Pagination.Item>
                                    <Pagination.Link
                                        isActive={page === 1}
                                        onPress={() => onPageChange(1)}
                                    >
                                        1
                                    </Pagination.Link>
                                </Pagination.Item>

                                {page > 3 && totalPages > 3 && (
                                    <Pagination.Item>
                                        <Pagination.Ellipsis />
                                    </Pagination.Item>
                                )}

                                {[page - 1, page, page + 1]
                                    .filter((p) => p > 1 && p < totalPages)
                                    .map((p) => (
                                        <Pagination.Item key={`comp-page-${p}`}>
                                            <Pagination.Link
                                                isActive={page === p}
                                                onPress={() => onPageChange(p)}
                                            >
                                                {p}
                                            </Pagination.Link>
                                        </Pagination.Item>
                                    ))}

                                {page < totalPages - 2 && totalPages > 3 && (
                                    <Pagination.Item>
                                        <Pagination.Ellipsis />
                                    </Pagination.Item>
                                )}

                                {totalPages > 1 && (
                                    <Pagination.Item>
                                        <Pagination.Link
                                            isActive={page === totalPages}
                                            onPress={() => onPageChange(totalPages)}
                                        >
                                            {totalPages}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                )}
                            </>
                        )}

                        <Pagination.Item>
                            <Pagination.Next
                                isDisabled={page >= totalPages}
                                onPress={() => onPageChange(page + 1)}
                            >
                                Sau
                            </Pagination.Next>
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination>
            </div>
        </div>
    );
}

interface TablePaginationBarProps {
    pagination?: TablePagination;
    totalPages: number;
    startItem: number;
    endItem: number;
    showPaginationInfo?: boolean;
    enablePagination?: boolean;
    selectionMode?: string;
    selectedKeys?: unknown;
}

function TablePaginationBar({
    pagination,
    totalPages,
    startItem,
    endItem,
    showPaginationInfo = true,
    enablePagination = true,
    selectionMode,
    selectedKeys,
}: Readonly<TablePaginationBarProps>) {
    if (!enablePagination || !pagination || totalPages <= 0) return null;

    let selectionSummary = null;
    if (showPaginationInfo) {
        if (selectionMode !== 'none' && selectedKeys && selectedKeys !== 'all') {
            const count = selectedKeys instanceof Set ? selectedKeys.size : 0;
            selectionSummary = `${count} of ${pagination.total} selected`;
        } else {
            selectionSummary = `Hiển thị ${startItem}-${endItem} / ${pagination.total}`;
        }
    }

    return (
        <div className="border-separator flex flex-col items-center justify-between gap-4 border-t p-4 sm:flex-row">
            {/* 1. Bên trái: Chọn số item / trang */}
            <div className="flex w-full items-center justify-start gap-2 sm:w-auto">
                {pagination.onPageSizeChange && (
                    <>
                        <span className="text-muted text-xs">Hiển thị:</span>
                        <div className="w-28">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button variant="ghost" size="sm">
                                        {pagination.pageSize} / trang
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Popover>
                                    <Dropdown.Menu
                                        aria-label="Số dòng mỗi trang"
                                        selectionMode="single"
                                        selectedKeys={new Set([String(pagination.pageSize)])}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0];
                                            if (selected) {
                                                pagination.onPageSizeChange?.(Number(selected));
                                            }
                                        }}
                                    >
                                        {(pagination.pageSizeOptions || [5, 10, 20, 50]).map(
                                            (size: number) => (
                                                <Dropdown.Item
                                                    id={String(size)}
                                                    key={String(size)}
                                                    textValue={`${size} / trang`}
                                                >
                                                    <Label>{size} / trang</Label>
                                                </Dropdown.Item>
                                            )
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                    </>
                )}
            </div>

            {/* 2. Ở giữa: Hiển thị thông tin số item */}
            <div className="text-center">
                {selectionSummary && (
                    <span className="text-muted text-xs tabular-nums">{selectionSummary}</span>
                )}
            </div>

            {/* 3. Bên phải: Chọn trang */}
            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
                <Pagination size="sm" className="flex justify-center sm:justify-end">
                    <Pagination.Content>
                        <Pagination.Item>
                            <Pagination.Previous
                                isDisabled={pagination.page <= 1}
                                onPress={() => pagination.onPageChange(pagination.page - 1)}
                            >
                                Trước
                            </Pagination.Previous>
                        </Pagination.Item>

                        {totalPages > 0 && (
                            <>
                                <Pagination.Item>
                                    <Pagination.Link
                                        isActive={pagination.page === 1}
                                        onPress={() => pagination.onPageChange(1)}
                                    >
                                        1
                                    </Pagination.Link>
                                </Pagination.Item>

                                {pagination.page > 3 && totalPages > 3 && (
                                    <Pagination.Item>
                                        <Pagination.Ellipsis />
                                    </Pagination.Item>
                                )}

                                {[pagination.page - 1, pagination.page, pagination.page + 1]
                                    .filter((p) => p > 1 && p < totalPages)
                                    .map((p) => (
                                        <Pagination.Item key={`page-${p}`}>
                                            <Pagination.Link
                                                isActive={pagination.page === p}
                                                onPress={() => pagination.onPageChange(p)}
                                            >
                                                {p}
                                            </Pagination.Link>
                                        </Pagination.Item>
                                    ))}

                                {pagination.page < totalPages - 2 && totalPages > 3 && (
                                    <Pagination.Item>
                                        <Pagination.Ellipsis />
                                    </Pagination.Item>
                                )}

                                {totalPages > 1 && (
                                    <Pagination.Item>
                                        <Pagination.Link
                                            isActive={pagination.page === totalPages}
                                            onPress={() => pagination.onPageChange(totalPages)}
                                        >
                                            {totalPages}
                                        </Pagination.Link>
                                    </Pagination.Item>
                                )}
                            </>
                        )}

                        <Pagination.Item>
                            <Pagination.Next
                                isDisabled={pagination.page >= totalPages}
                                onPress={() => pagination.onPageChange(pagination.page + 1)}
                            >
                                Sau
                            </Pagination.Next>
                        </Pagination.Item>
                    </Pagination.Content>
                </Pagination>
            </div>
        </div>
    );
}

interface TableToolbarProps<T extends object> {
    showSearch?: boolean;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    showFilters?: boolean;
    filterableColumns: TableColumn<T>[];
    filters: Record<string, unknown>;
    handleFilterChange: (key: string, value: string) => void;
    pagination?: TablePagination;
    toolbarContent?: ReactNode;
    showRefresh?: boolean;
    isLoading?: boolean;
    onRefresh?: () => void;
}

function TableToolbar<T extends object>({
    showSearch,
    searchPlaceholder,
    searchValue,
    onSearchChange,
    showFilters,
    filterableColumns,
    filters,
    handleFilterChange,
    pagination,
    toolbarContent,
    showRefresh,
    isLoading,
    onRefresh,
}: Readonly<TableToolbarProps<T>>) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    {showSearch && (
                        <div className="relative w-full sm:max-w-50">
                            <MagnifyingGlassIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                className="w-full pl-10"
                                placeholder={searchPlaceholder}
                                value={searchValue}
                                onChange={(e) => onSearchChange?.(e.target.value)}
                            />
                        </div>
                    )}

                    {showFilters &&
                        filterableColumns.map((column) => {
                            if (column.filterType === 'select' && column.filterOptions) {
                                return (
                                    <Dropdown key={column.key}>
                                        <Dropdown.Trigger>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="hidden sm:flex"
                                            >
                                                {column.label}
                                                {Boolean(filters[column.key]) && (
                                                    <span className="text-primary ml-1">
                                                        ({String(filters[column.key])})
                                                    </span>
                                                )}
                                                <ChevronDownIcon className="ml-1 h-4 w-4" />
                                            </Button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Popover>
                                            <Dropdown.Menu
                                                disallowEmptySelection={false}
                                                aria-label={`Filter by ${column.label}`}
                                                selectedKeys={
                                                    filters[column.key]
                                                        ? new Set([String(filters[column.key])])
                                                        : new Set()
                                                }
                                                selectionMode="single"
                                                onSelectionChange={(keys) => {
                                                    const selected = Array.from(keys)[0];
                                                    handleFilterChange(
                                                        column.key,
                                                        selected ? String(selected) : ''
                                                    );
                                                }}
                                            >
                                                {column.filterOptions.map((opt) => (
                                                    <Dropdown.Item
                                                        id={opt.key}
                                                        key={opt.key}
                                                        textValue={opt.label}
                                                    >
                                                        <Label>{opt.label}</Label>
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown.Popover>
                                    </Dropdown>
                                );
                            }
                            return null;
                        })}
                </div>

                <div className="flex items-center gap-3">
                    {pagination && (
                        <span className="text-small text-default-400">
                            Total: <strong>{pagination.total}</strong> row(s)
                        </span>
                    )}

                    {toolbarContent}

                    {pagination?.onPageSizeChange && (
                        <div className="flex items-center gap-1">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <Button variant="ghost" size="sm">
                                        {pagination.pageSize} / page
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </Button>
                                </Dropdown.Trigger>
                                <Dropdown.Popover>
                                    <Dropdown.Menu
                                        aria-label="Rows per page"
                                        selectionMode="single"
                                        selectedKeys={new Set([String(pagination.pageSize)])}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0];
                                            if (selected) {
                                                pagination.onPageSizeChange?.(Number(selected));
                                            }
                                        }}
                                    >
                                        {(pagination.pageSizeOptions || [5, 10, 20, 50]).map(
                                            (size: number) => (
                                                <Dropdown.Item
                                                    id={String(size)}
                                                    key={String(size)}
                                                    textValue={String(size)}
                                                >
                                                    <Label>{String(size)}</Label>
                                                </Dropdown.Item>
                                            )
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                    )}

                    {showRefresh && (
                        <Tooltip>
                            <Tooltip.Trigger>
                                <Button
                                    isIconOnly
                                    variant="ghost"
                                    size="sm"
                                    isPending={isLoading}
                                    onPress={onRefresh}
                                >
                                    <ArrowPathIcon
                                        className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                                    />
                                </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Content>Refresh</Tooltip.Content>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
}

// ==================== COMPONENT ====================

function InternalDataTable<T extends object = Record<string, unknown>>({
    items = [],
    columns = [],
    actions = [],
    onRowAction,
    getRowKey = (item: T) => {
        const record = item as Record<string, unknown>;
        return (record.id as string | number) ?? (record.key as string | number) ?? 'item';
    },
    isLoading = false,
    enableSkeleton = true,
    skeletonRows = 10,
    emptyContent = 'No data found',
    loadingContent,
    pagination,
    showPaginationInfo = true,
    sortDescriptor,
    onSortChange,
    showSearch = false,
    searchPlaceholder = 'Search...',
    searchValue = '',
    onSearchChange,
    showFilters = false,
    filters = {},
    onFilterChange,
    visibleColumns = 'all',
    onVisibleColumnsChange: _onVisibleColumnsChange,
    showColumnToggle: _showColumnToggle = false,
    actionsLabel = 'Actions',
    actionsWidth = 120,
    toolbarContent,
    showRefresh = false,
    onRefresh,
    isStriped: _isStriped = true,
    isCompact: _isCompact = false,
    selectionMode = 'none',
    selectedKeys,
    onSelectionChange,
    topContent,
    bottomContent,
    isHeaderSticky: _isHeaderSticky = true,
    maxHeight,
    'aria-label': ariaLabel = 'Data table',
}: Readonly<CommonTableProps<T>>) {
    // Calculate pagination info
    const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0;
    const startItem = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 0;
    const endItem = pagination
        ? Math.min(pagination.page * pagination.pageSize, pagination.total)
        : items.length;

    // Determine if we should show skeleton
    const showSkeleton = isLoading && enableSkeleton && items.length === 0;

    // Prepare items for rendering
    // If showing skeleton, use dummy array. Cast to any[] since T is unknown.
    // The items itself will be undefined but we just need the length.
    const displayItems = showSkeleton
        ? (Array.from({ length: skeletonRows }).map((_, i) => ({
              _isSkeleton: true,
              id: `skeleton-${i}`,
          })) as unknown as T[])
        : items;

    // Override isLoading if showing skeleton (to prevent spinner)
    const tableIsLoading = isLoading && !showSkeleton;

    // Get filterable columns
    const filterableColumns = useMemo(() => columns.filter((col) => col.filterable), [columns]);

    // Handle sort change
    const handleSortChange = useCallback(
        (descriptor: SortDescriptor) => {
            onSortChange?.(descriptor);
        },
        [onSortChange]
    );

    // Handle filter change
    const handleFilterChange = useCallback(
        (key: string, value: string) => {
            onFilterChange?.({
                ...filters,
                [key]: value || undefined,
            });
        },
        [filters, onFilterChange]
    );

    const renderCell = (item: T, columnKey: string, index: number) => {
        // Check for skeleton
        if ((item as Record<string, unknown>)._isSkeleton) {
            return (
                <Skeleton className="w-full rounded-lg">
                    <div className="bg-default-200 h-3 w-4/5 rounded-lg"></div>
                </Skeleton>
            );
        }

        // Actions column
        if (columnKey === '_actions' && actions) {
            return (
                <div className="flex items-center gap-1">
                    {actions.map((action) => {
                        if (action.isVisible && !action.isVisible(item)) {
                            return null;
                        }

                        const isDisabled = action.isDisabled ? action.isDisabled(item) : false;
                        const icon = action.icon || defaultIcons[action.key];

                        let textColorClass = 'text-primary';
                        if (action.color === 'danger') textColorClass = 'text-danger';
                        else if (action.color === 'success') textColorClass = 'text-success';

                        return (
                            <Tooltip key={action.key}>
                                <Tooltip.Trigger>
                                    <Button
                                        className={`hover:bg-default-100 min-h-8 min-w-8 bg-transparent p-1 ${textColorClass}`}
                                        aria-label={action.label}
                                        isDisabled={isDisabled}
                                        onPress={() => action.onClick(item)}
                                    >
                                        {icon}
                                    </Button>
                                </Tooltip.Trigger>
                                <Tooltip.Content>{action.label}</Tooltip.Content>
                            </Tooltip>
                        );
                    })}
                </div>
            );
        }

        // Custom render function
        const column = columns.find((col) => col.key === columnKey);
        if (column?.render) {
            return column.render(item, index);
        }

        // Default: access property by key
        const value = (item as Record<string, unknown>)[columnKey];
        if (value === null || value === undefined) {
            return <span className="text-gray-400">-</span>;
        }
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return String(value);
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return '';
    };

    // ==================== TOOLBAR ====================

    // Get visible columns for rendering
    const displayColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;
        return columns.filter((col) => visibleColumns.has(col.key));
    }, [columns, visibleColumns]);

    // Build visible columns Set for rendering (includes actions)
    const tableColumnsFiltered = useMemo(
        () => [
            ...displayColumns,
            ...(actions && actions.length > 0
                ? [
                      {
                          key: '_actions',
                          label: actionsLabel,
                          width: actionsWidth,
                      },
                  ]
                : []),
        ],
        [displayColumns, actions, actionsLabel, actionsWidth]
    );

    const defaultTopContent = (
        <TableToolbar
            showSearch={showSearch}
            searchPlaceholder={searchPlaceholder}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            showFilters={showFilters}
            filterableColumns={filterableColumns}
            filters={filters}
            handleFilterChange={handleFilterChange}
            pagination={pagination}
            toolbarContent={toolbarContent}
            showRefresh={showRefresh}
            isLoading={isLoading}
            onRefresh={onRefresh}
        />
    );

    const defaultBottomContent = (
        <TablePaginationBar
            pagination={pagination}
            totalPages={totalPages}
            startItem={startItem}
            endItem={endItem}
            showPaginationInfo={showPaginationInfo}
            selectionMode={selectionMode}
            selectedKeys={selectedKeys}
        />
    );

    // ==================== RENDER ====================

    return (
        <div className="flex flex-col gap-4">
            {topContent !== undefined ? topContent : defaultTopContent}

            <BaseTable className="w-full">
                <BaseTable.ScrollContainer>
                    <BaseTable.Content
                        aria-label={ariaLabel}
                        selectionMode={selectionMode === 'none' ? undefined : selectionMode}
                        selectedKeys={selectedKeys}
                        onSelectionChange={
                            onSelectionChange as
                                | ((keys: 'all' | Set<React.Key>) => void)
                                | undefined
                        }
                        sortDescriptor={sortDescriptor}
                        onSortChange={handleSortChange}
                        className={maxHeight ? `max-h-[${maxHeight}]` : ''}
                    >
                        <BaseTable.Header>
                            {tableColumnsFiltered.map((col, index) => {
                                const alignClass = getColumnAlignmentClass(col);
                                return (
                                    <BaseTable.Column
                                        key={col.key}
                                        id={col.key}
                                        isRowHeader={index === 0}
                                        allowsSorting={col.sortable}
                                        className={alignClass}
                                    >
                                        {col.sortable
                                            ? ({ sortDirection }) => (
                                                  <BaseTable.SortableColumnHeader
                                                      sortDirection={sortDirection}
                                                  >
                                                      {col.label}
                                                  </BaseTable.SortableColumnHeader>
                                              )
                                            : col.label}
                                    </BaseTable.Column>
                                );
                            })}
                        </BaseTable.Header>

                        <BaseTable.Body
                            renderEmptyState={() => (
                                <div className="text-default-500 flex w-full flex-col items-center justify-center py-10">
                                    {tableIsLoading
                                        ? loadingContent || <Spinner size="md" />
                                        : emptyContent}
                                </div>
                            )}
                        >
                            {displayItems.map((item, index) => {
                                const record = item as Record<string, unknown>;
                                const key = resolveRowKey(item, index, getRowKey);

                                return (
                                    <BaseTable.Row
                                        key={key}
                                        id={key}
                                        className={
                                            onRowAction && !record._isSkeleton
                                                ? 'hover:bg-default-100 cursor-pointer'
                                                : ''
                                        }
                                    >
                                        {tableColumnsFiltered.map((col) => {
                                            const alignClass = getColumnAlignmentClass(col);
                                            return (
                                                <BaseTable.Cell
                                                    key={col.key}
                                                    className={alignClass}
                                                >
                                                    {renderCell(item, col.key, index)}
                                                </BaseTable.Cell>
                                            );
                                        })}
                                    </BaseTable.Row>
                                );
                            })}
                        </BaseTable.Body>
                    </BaseTable.Content>
                </BaseTable.ScrollContainer>
            </BaseTable>

            {bottomContent !== undefined ? bottomContent : defaultBottomContent}
        </div>
    );
}

/**
 * Table Component - Hỗ trợ cả 2 chế độ:
 * 1. Compound Pattern của HeroUI v3 (nếu truyền children): Table.ScrollContainer, Table.Content, Table.Header, Table.Body...
 * 2. Data Table thông minh (nếu truyền items, columns, pagination, filters...)
 */
export function Table<T extends object = Record<string, unknown>>(
    props: Readonly<CommonTableProps<T>>
) {
    if (props.children) {
        return (
            <BaseTable variant={props.variant} className={props.className}>
                {props.children}
            </BaseTable>
        );
    }
    return <InternalDataTable {...props} />;
}

Table.ScrollContainer = BaseTable.ScrollContainer;
Table.Content = BaseTable.Content;
Table.Header = BaseTable.Header;
Table.Column = BaseTable.Column;
Table.Body = BaseTable.Body;
Table.Row = BaseTable.Row;
Table.Cell = BaseTable.Cell;
Table.Footer = BaseTable.Footer;
Table.SortableColumnHeader = BaseTable.SortableColumnHeader;
Table.ColumnResizer = BaseTable.ColumnResizer;
Table.LoadMore = BaseTable.LoadMore;
Table.LoadMoreContent = BaseTable.LoadMoreContent;
Table.EmptyState = EmptyState;
Table.PaginationFooter = TablePaginationFooter;

export { BaseTable };
