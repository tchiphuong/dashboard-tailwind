import { ReactNode, useMemo, useCallback } from 'react';
import {
    Table as HeroTable,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Button,
    Tooltip,
    Input,
    SortDescriptor,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    SelectItem,
    Skeleton,
    Spinner,
} from '@heroui/react';
import { Select } from '@/components/common';
import {
    ArrowPathIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
} from '@heroicons/react/24/outline';

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

// Table props
export interface CommonTableProps<T> {
    items: T[];
    columns: TableColumn<T>[];
    getRowKey: (item: T) => string | number;

    // Optional features
    isLoading?: boolean;
    enableSkeleton?: boolean;
    skeletonRows?: number;
    emptyContent?: ReactNode;
    loadingContent?: ReactNode;

    // Pagination
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

const defaultColors: Record<
    string,
    'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
> = {
    view: 'default',
    edit: 'primary',
    delete: 'danger',
};

// ==================== COMPONENT ====================

export function Table<T>({
    items,
    columns,
    getRowKey,
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
    onVisibleColumnsChange,
    showColumnToggle = false,
    actions,
    actionsLabel = 'Actions',
    actionsWidth = 120,
    toolbarContent,
    showRefresh = false,
    onRefresh,
    isStriped = true,
    isCompact = false,
    selectionMode = 'none',
    selectedKeys,
    onSelectionChange,
    topContent,
    bottomContent,
    isHeaderSticky = true,
    maxHeight,
    'aria-label': ariaLabel = 'Data table',
}: CommonTableProps<T>) {
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

    // Render cell content
    const renderCell = (item: T, columnKey: string, index: number) => {
        // Check for skeleton
        if ((item as any)._isSkeleton) {
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
                        const color = action.color || defaultColors[action.key] || 'default';

                        return (
                            <Tooltip
                                key={action.key}
                                content={action.label}
                                color={color === 'default' ? undefined : color}
                            >
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    color={color}
                                    radius="full"
                                    aria-label={action.label}
                                    isDisabled={isDisabled}
                                    onPress={() => action.onClick(item)}
                                >
                                    {icon}
                                </Button>
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
        return String(value);
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
                ? [{ key: '_actions', label: actionsLabel, width: actionsWidth }]
                : []),
        ],
        [displayColumns, actions, actionsLabel, actionsWidth]
    );

    const defaultTopContent = (
        <div className="flex flex-col gap-4">
            {/* Main toolbar row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                {/* Left side: Search + Filter dropdowns */}
                <div className="flex flex-1 flex-wrap items-center gap-3">
                    {showSearch && (
                        <Input
                            isClearable
                            className="w-full sm:max-w-50"
                            placeholder={searchPlaceholder}
                            startContent={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                            value={searchValue}
                            onClear={() => onSearchChange?.('')}
                            onValueChange={onSearchChange}
                            variant="bordered"
                            radius="lg"
                            size="sm"
                        />
                    )}

                    {/* Inline filter dropdowns */}
                    {showFilters &&
                        filterableColumns.map((column) => {
                            if (column.filterType === 'select' && column.filterOptions) {
                                return (
                                    <Dropdown key={column.key}>
                                        <DropdownTrigger className="hidden sm:flex">
                                            <Button
                                                endContent={<ChevronDownIcon className="h-4 w-4" />}
                                                variant="flat"
                                                size="sm"
                                                radius="lg"
                                            >
                                                {column.label}
                                                {filters[column.key] && (
                                                    <span className="text-primary ml-1">
                                                        ({filters[column.key]})
                                                    </span>
                                                )}
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu
                                            disallowEmptySelection={false}
                                            aria-label={`Filter by ${column.label}`}
                                            closeOnSelect
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
                                                    (selected as string) || ''
                                                );
                                            }}
                                        >
                                            {[
                                                { key: '', label: 'All' },
                                                ...column.filterOptions,
                                            ].map((opt) => (
                                                <DropdownItem key={opt.key}>
                                                    {opt.label}
                                                </DropdownItem>
                                            ))}
                                        </DropdownMenu>
                                    </Dropdown>
                                );
                            }
                            return null;
                        })}

                    {/* Columns visibility dropdown */}
                    {showColumnToggle && (
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={<ChevronDownIcon className="h-4 w-4" />}
                                    variant="flat"
                                    size="sm"
                                    radius="lg"
                                >
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Toggle columns"
                                closeOnSelect={false}
                                selectedKeys={
                                    visibleColumns === 'all'
                                        ? new Set(columns.map((c) => c.key))
                                        : visibleColumns
                                }
                                selectionMode="multiple"
                                onSelectionChange={(keys) => {
                                    onVisibleColumnsChange?.(keys as Set<string>);
                                }}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.key} className="capitalize">
                                        {column.label}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    )}
                </div>

                {/* Right side: Custom content, rows per page & Refresh */}
                <div className="flex items-center gap-3">
                    {pagination && (
                        <span className="text-small text-default-400">
                            Total: <strong>{pagination.total}</strong> row(s)
                        </span>
                    )}

                    {toolbarContent}

                    {pagination?.onPageSizeChange && (
                        <div className="flex items-center gap-1">
                            {/* <div className="text-small text-default-400">Rows per page:</div> */}
                            <Select
                                items={(pagination.pageSizeOptions || [5, 10, 20, 50]).map(
                                    (size) => ({
                                        key: String(size),
                                        label: String(size),
                                    })
                                )}
                                selectedKeys={new Set([String(pagination.pageSize)])}
                                disallowEmptySelection
                                aria-label="Rows per page"
                                size="sm"
                                className="min-w-20"
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys)[0];
                                    if (selected) {
                                        pagination.onPageSizeChange?.(Number(selected));
                                    }
                                }}
                            >
                                {(item) => (
                                    <SelectItem key={item.key} textValue={item.label}>
                                        {item.label}
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                    )}

                    {showRefresh && (
                        <Tooltip content="Refresh">
                            <Button
                                isIconOnly
                                variant="flat"
                                radius="lg"
                                size="sm"
                                isLoading={isLoading}
                                onPress={onRefresh}
                            >
                                <ArrowPathIcon
                                    className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
                                />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );

    // ==================== PAGINATION ====================
    const defaultBottomContent = pagination && totalPages > 0 && (
        <div className="flex items-center justify-between px-2 py-2">
            {showPaginationInfo && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {startItem} - {endItem} of {pagination.total}
                </span>
            )}
            <Pagination
                showControls
                color="primary"
                page={pagination.page}
                total={totalPages}
                onChange={pagination.onPageChange}
                radius="full"
                variant="light"
                isDisabled={isLoading}
            />
        </div>
    );

    // Default loading content
    const defaultLoadingContent = <Spinner size="lg" color="primary" />;

    // ==================== RENDER ====================
    return (
        <div className="flex flex-col gap-4">
            {/* Top content / Toolbar */}
            {(showSearch || showFilters || showColumnToggle || toolbarContent || showRefresh) &&
                (topContent || defaultTopContent)}

            {/* Table */}
            <HeroTable
                aria-label={ariaLabel}
                isStriped={isStriped}
                isCompact={isCompact}
                isHeaderSticky={isHeaderSticky}
                selectionMode={selectionMode}
                selectedKeys={selectedKeys as any}
                onSelectionChange={onSelectionChange as any}
                sortDescriptor={sortDescriptor}
                onSortChange={handleSortChange}
                classNames={{
                    wrapper: `rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 ${
                        maxHeight ? 'overflow-y-auto' : ''
                    }`,
                    th: 'bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-300 font-semibold',
                }}
                style={{
                    maxHeight: maxHeight,
                }}
                bottomContent={bottomContent || defaultBottomContent}
                bottomContentPlacement="outside"
            >
                <TableHeader>
                    {tableColumnsFiltered.map((column) => (
                        <TableColumn
                            key={column.key}
                            width={column.width}
                            align={column.align}
                            allowsSorting={column.sortable}
                        >
                            {column.label}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody
                    items={displayItems}
                    isLoading={tableIsLoading}
                    loadingContent={loadingContent || defaultLoadingContent}
                    emptyContent={emptyContent}
                >
                    {(item) => (
                        <TableRow key={getRowKey(item)}>
                            {tableColumnsFiltered.map((column, index) => (
                                <TableCell key={column.key}>
                                    {renderCell(item, column.key, index)}
                                </TableCell>
                            ))}
                        </TableRow>
                    )}
                </TableBody>
            </HeroTable>
        </div>
    );
}

// Re-export types
export type {
    TableColumn as ColumnDef,
    TableAction as ActionDef,
    TablePagination as PaginationInfo,
    TableSort as SortInfo,
    TableFilter as FilterValues,
};
