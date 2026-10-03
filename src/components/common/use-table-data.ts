import { useCallback, useEffect, useRef, useState } from 'react';

import { SortDescriptor, TableFilter } from './table';
import { notifyFetchError, notifyFetchSuccess } from './toast';

// ==================== TYPES ====================

// API Response format (standardized per user_rules)
export interface ApiResponse<T> {
    returnCode: number;
    errors: string[];
    message: string;
    data: T;
}

export interface PagedResult<T> {
    items: T[];
    paging: PagingInfo;
}

export interface PagingInfo {
    pageIndex: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

// Fetch params
export interface FetchParams {
    page: number;
    pageSize: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    filters?: TableFilter;
}

// Hook options
export interface UseTableDataOptions<T> {
    // API endpoint or fetch function
    fetchFn: (params: FetchParams) => Promise<ApiResponse<PagedResult<T>> | PagedResult<T>>;

    // Initial values
    initialPage?: number;
    initialPageSize?: number;
    initialSearch?: string;
    initialSort?: SortDescriptor;
    initialFilters?: TableFilter;

    // Callbacks
    onError?: (error: Error) => void;
    onSuccess?: (data: PagedResult<T>) => void;

    // Options
    autoFetch?: boolean;
    debounceMs?: number;
    /** Tên đối tượng dữ liệu để tự động bắn Toast chuẩn hóa (ví dụ: "dự án", "người dùng") */
    entityName?: string;
    /** Tự động bật Toast khi tải xong (mặc định: true nếu có entityName) */
    showToast?: boolean;
}

// Hook return type
export interface UseTableDataReturn<T> {
    // Data
    items: T[];
    total: number;
    isLoading: boolean;
    error: Error | null;

    // Pagination
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;

    // Search
    search: string;
    setSearch: (search: string) => void;

    // Sort
    sortDescriptor: SortDescriptor | undefined;
    setSortDescriptor: (descriptor: SortDescriptor) => void;

    // Filters
    filters: TableFilter;
    setFilters: (filters: TableFilter) => void;
    setFilter: (key: string, value: string | number | undefined) => void;
    clearFilters: () => void;

    // Actions
    refresh: () => void;
    reset: () => void;
}

function resolveSortDirection(direction?: 'ascending' | 'descending'): 'asc' | 'desc' | undefined {
    if (direction === 'ascending') return 'asc';
    if (direction === 'descending') return 'desc';
    return undefined;
}

function unwrapPagedResult<T>(
    response: ApiResponse<PagedResult<T>> | PagedResult<T>
): PagedResult<T> {
    if ('returnCode' in response) {
        if (response.returnCode !== 0) {
            throw new Error(response.message || 'API Error');
        }
        return response.data;
    }
    return response;
}

// ==================== HOOK ====================

export function useTableData<T>(options: UseTableDataOptions<T>): UseTableDataReturn<T> {
    const {
        fetchFn,
        initialPage = 1,
        initialPageSize = 20,
        initialSearch = '',
        initialSort,
        initialFilters = {},
        onError,
        onSuccess,
        autoFetch = true,
        debounceMs = 300,
        entityName,
        showToast = true,
    } = options;

    // State
    const [items, setItems] = useState<T[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [page, setPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [search, setSearch] = useState(initialSearch);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor | undefined>(initialSort);
    const [filters, setFilters] = useState<TableFilter>(initialFilters);

    // Refs for debouncing
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const abortControllerRef = useRef<AbortController | undefined>(undefined);

    // Fetch data
    const fetchData = useCallback(async () => {
        // Cancel previous request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);

        try {
            const params: FetchParams = {
                page,
                pageSize,
                search: search || undefined,
                sortBy: sortDescriptor?.column as string | undefined,
                sortDirection: resolveSortDirection(sortDescriptor?.direction),
                filters: Object.keys(filters).length > 0 ? filters : undefined,
            };

            const response = await fetchFn(params);
            const result = unwrapPagedResult(response);

            setItems(result.items);
            setTotal(result.paging.totalItems);
            onSuccess?.(result);

            if (entityName && showToast) {
                notifyFetchSuccess(entityName, result.paging.totalItems);
            }
        } catch (err) {
            if ((err as Error).name === 'AbortError') {
                return; // Ignore aborted requests
            }
            const fetchError = err instanceof Error ? err : new Error('Unknown error');
            setError(fetchError);
            onError?.(fetchError);

            if (entityName && showToast) {
                notifyFetchError(entityName, fetchError.message);
            }
        } finally {
            setIsLoading(false);
        }
    }, [
        fetchFn,
        page,
        pageSize,
        search,
        sortDescriptor,
        filters,
        onError,
        onSuccess,
        entityName,
        showToast,
    ]);

    // Debounced search effect
    useEffect(() => {
        if (!autoFetch) return;

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            fetchData();
        }, debounceMs);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [fetchData, autoFetch, debounceMs]);

    // Reset page when search/filters change
    useEffect(() => {
        setPage(1);
    }, [search, filters]);

    // Set single filter
    const setFilter = useCallback((key: string, value: string | number | undefined) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    }, []);

    // Clear all filters
    const clearFilters = useCallback(() => {
        setFilters({});
        setSearch('');
    }, []);

    // Refresh data
    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Reset to initial state
    const reset = useCallback(() => {
        setPage(initialPage);
        setPageSize(initialPageSize);
        setSearch(initialSearch);
        setSortDescriptor(initialSort);
        setFilters(initialFilters);
    }, [initialPage, initialPageSize, initialSearch, initialSort, initialFilters]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    return {
        // Data
        items,
        total,
        isLoading,
        error,

        // Pagination
        page,
        pageSize,
        setPage,
        setPageSize,

        // Search
        search,
        setSearch,

        // Sort
        sortDescriptor,
        setSortDescriptor,

        // Filters
        filters,
        setFilters,
        setFilter,
        clearFilters,

        // Actions
        refresh,
        reset,
    };
}

// ==================== HELPER: Build Query String ====================

export function buildQueryString(params: FetchParams): string {
    const searchParams = new URLSearchParams();

    searchParams.set('pageIndex', String(params.page));
    searchParams.set('pageSize', String(params.pageSize));

    if (params.search) {
        searchParams.set('keyword', params.search);
    }

    if (params.sortBy) {
        searchParams.set('sortBy', params.sortBy);
    }

    if (params.sortDirection) {
        searchParams.set('sortDirection', params.sortDirection);
    }

    if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                searchParams.set(key, String(value));
            }
        });
    }

    return searchParams.toString();
}

// ==================== HELPER: Create Fetch Function ====================

export function createApiFetch<T>(
    baseUrl: string,
    options?: RequestInit
): (params: FetchParams) => Promise<ApiResponse<PagedResult<T>>> {
    return async (params: FetchParams) => {
        const queryString = buildQueryString(params);
        const url = `${baseUrl}?${queryString}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return response.json();
    };
}
