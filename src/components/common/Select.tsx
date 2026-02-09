import { useState, useEffect, useCallback } from 'react';
import { Select as HeroSelect, SelectProps as HeroSelectProps, Spinner } from '@heroui/react';
import { FetchParams, PagedResult, ApiResponse } from './useTableData';

export interface SelectProps<T extends object = object> extends Omit<
    HeroSelectProps<T>,
    'children'
> {
    fetchFn?: (params: FetchParams) => Promise<ApiResponse<PagedResult<T>> | PagedResult<T>>;
    pageSize?: number;
    dependencies?: any[];
    children?: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object = object>({
    children,
    radius = 'full',
    variant = 'bordered',
    labelPlacement = 'outside-top',
    classNames,
    fetchFn,
    pageSize = 10,
    dependencies = [],
    items: propItems,
    ...props
}: SelectProps<T>) {
    // Async State
    const [items, setItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    // Initial Fetch (Triggered by Open)
    useEffect(() => {
        if (!fetchFn || !isOpen || initialLoaded) return;

        let active = true;

        const loadInitial = async () => {
            setIsLoading(true);
            try {
                const result = await fetchFn({ page: 1, pageSize });
                const data = 'data' in result ? result.data : result;

                if (active) {
                    setItems(data.items);
                    setHasMore(data.items.length >= pageSize);
                    setPage(1);
                    setInitialLoaded(true);
                }
            } catch (error) {
                console.error('Failed to load select items', error);
            } finally {
                if (active) setIsLoading(false);
            }
        };

        loadInitial();

        return () => {
            active = false;
        };
    }, [fetchFn, pageSize, isOpen, initialLoaded, ...dependencies]);

    // Reset when dependencies change
    useEffect(() => {
        setInitialLoaded(false);
        setItems([]);
        setPage(1);
        setHasMore(true);
    }, [...dependencies]);

    // Load More
    const onLoadMore = useCallback(async () => {
        if (!fetchFn || !hasMore || isLoading) return;

        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const result = await fetchFn({ page: nextPage, pageSize });
            const data = 'data' in result ? result.data : result;

            setItems((prev) => [...prev, ...data.items]);
            setHasMore(data.items.length >= pageSize);
            setPage(nextPage);
        } catch (error) {
            console.error('Failed to load more select items', error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchFn, hasMore, isLoading, page, pageSize]);

    // Scroll Handler
    const onScroll = (e: React.UIEvent<HTMLElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) {
            // Threshold 50px
            onLoadMore();
        }
    };

    const finalItems = fetchFn ? items : propItems;

    return (
        <HeroSelect
            radius={radius}
            variant={variant}
            labelPlacement={labelPlacement}
            items={finalItems}
            isLoading={isLoading && items.length === 0}
            scrollRef={(ref) => {
                if (ref) {
                    ref.onscroll = onScroll as any;
                }
            }}
            onOpenChange={setIsOpen}
            listboxProps={{
                bottomContent:
                    hasMore && items.length > 0 && isLoading ? (
                        <div className="flex w-full justify-center p-2">
                            <Spinner size="sm" color="current" />
                        </div>
                    ) : null,
            }}
            {...props}
        >
            {children as any}
        </HeroSelect>
    );
}
