import { useMemo, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Chip, User, SelectItem } from '@heroui/compat';
import {
    PageHeader,
    Table,
    Button,
    Input,
    Select,
    useTableData,
    type FetchParams,
    type PagedResult,
    type TableColumn,
    type TableAction,
} from '@/components/common';
import {
    PlusIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

import { ProductService } from '@/services/product.service';
import type { Product } from '@/types/product.types';

const categories = [
    { key: 'beauty', label: 'Beauty' },
    { key: 'fragrances', label: 'Fragrances' },
    { key: 'furniture', label: 'Furniture' },
    { key: 'groceries', label: 'Groceries' },
    { key: 'home-decoration', label: 'Home Decoration' },
    { key: 'kitchen-accessories', label: 'Kitchen' },
    { key: 'laptops', label: 'Laptops' },
    { key: 'mens-shirts', label: "Men's Shirts" },
    { key: 'mens-shoes', label: "Men's Shoes" },
    { key: 'mens-watches', label: "Men's Watches" },
    { key: 'mobile-accessories', label: 'Mobile Accessories' },
    { key: 'motorcycle', label: 'Motorcycle' },
    { key: 'skin-care', label: 'Skin Care' },
    { key: 'smartphones', label: 'Smartphones' },
    { key: 'sports-accessories', label: 'Sports' },
    { key: 'sunglasses', label: 'Sunglasses' },
    { key: 'tablets', label: 'Tablets' },
    { key: 'tops', label: 'Tops' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'womens-bags', label: "Women's Bags" },
    { key: 'womens-dresses', label: "Women's Dresses" },
    { key: 'womens-jewellery', label: "Women's Jewellery" },
    { key: 'womens-shoes', label: "Women's Shoes" },
    { key: 'womens-watches', label: "Women's Watches" },
];

const fetchProducts = async (params: FetchParams): Promise<PagedResult<Product>> => {
    const res = await ProductService.list({
        keyword: params.search,
        category: params.filters?.category ? String(params.filters.category) : undefined,
        pageIndex: params.page,
        pageSize: params.pageSize,
    });
    return res.data || {
        items: [],
        paging: {
            pageIndex: params.page,
            pageSize: params.pageSize,
            totalItems: 0,
            totalPages: 0,
        },
    };
};

export function ProductsPage() {
    const t = useTranslations();

    const {
        items: products,
        isLoading,
        total,
        page,
        pageSize,
        search,
        filters,
        setPage,
        setPageSize,
        setSearch,
        setFilters,
        refresh,
    } = useTableData<Product>({
        fetchFn: fetchProducts,
        initialPageSize: 10,
    });

    const getStockColor = useCallback((stock: number): 'success' | 'warning' | 'danger' => {
        if (stock > 50) return 'success';
        if (stock > 10) return 'warning';
        return 'danger';
    }, []);

    const columns: TableColumn<Product>[] = useMemo(
        () => [
            {
                key: 'id',
                label: t('common.id'),
                sortable: true,
                render: (item: Product) => <span className="text-gray-500">#{item.id}</span>,
            },
            {
                key: 'title',
                label: t('menu.product.fields.product'),
                sortable: true,
                render: (item: Product) => (
                    <User
                        avatarProps={{ radius: 'lg', src: item.thumbnail }}
                        description={item.brand}
                        name={item.title}
                    >
                        {item.title}
                    </User>
                ),
            },
            {
                key: 'category',
                label: t('menu.product.fields.category'),
                render: (item: Product) => (
                    <Chip size="sm" variant="flat" color="primary" className="capitalize">
                        {(item.category ?? 'general').replace('-', ' ')}
                    </Chip>
                ),
            },
            {
                key: 'price',
                label: t('menu.product.fields.price'),
                sortable: true,
                render: (item: Product) => (
                    <div className="flex flex-col">
                        <span className="font-semibold text-green-600 dark:text-green-400 tabular-nums">
                            ${item.price.toFixed(2)}
                        </span>
                        {(item.discountPercentage ?? 0) > 0 && (
                            <span className="text-xs text-red-500 tabular-nums">
                                -{Math.round(item.discountPercentage ?? 0)}%
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: 'stock',
                label: t('menu.product.fields.stock'),
                sortable: true,
                render: (item: Product) => (
                    <Chip size="sm" variant="dot" color={getStockColor(item.stock)}>
                        {item.stock}
                    </Chip>
                ),
            },
            {
                key: 'rating',
                label: t('menu.product.fields.rating'),
                sortable: true,
                render: (item: Product) => (
                    <div className="flex w-fit items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 dark:bg-yellow-900/20">
                        <span className="text-xs text-yellow-500">★</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {item.rating.toFixed(1)}
                        </span>
                    </div>
                ),
            },
        ],
        [t, getStockColor]
    );

    const actions: TableAction<Product>[] = useMemo(
        () => [
            {
                key: 'view',
                label: t('common.view'),
                icon: <EyeIcon className="h-4 w-4" />,
                onClick: (item) => console.log('View', item),
            },
            {
                key: 'edit',
                label: t('common.edit'),
                icon: <PencilIcon className="h-4 w-4" />,
                onClick: (item) => console.log('Edit', item),
            },
            {
                key: 'delete',
                label: t('common.delete'),
                icon: <TrashIcon className="h-4 w-4" />,
                color: 'danger',
                onClick: (item) => console.log('Delete', item),
            },
        ],
        [t]
    );

    const topContent = useMemo(
        () => (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-1 items-center gap-3">
                        <Input
                            isClearable
                            className="w-full sm:max-w-[44%]"
                            placeholder={t('common.search') + '...'}
                            startContent={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                            value={search}
                            onClear={() => setSearch('')}
                            onValueChange={setSearch}
                        />
                        <div className="w-full sm:max-w-50">
                            <Select
                                placeholder={t('menu.product.fields.category')}
                                items={categories}
                                selectedKeys={filters.category ? [filters.category as string] : []}
                                onSelectionChange={(keys) => {
                                    const selected = Array.from(keys as Iterable<string | number>)[0] as string;
                                    setFilters({ ...filters, category: selected });
                                    // Clear search when filtering by category as API logic implies mutual exclusivity or preference
                                    if (selected) setSearch('');
                                }}
                                className="w-full"
                            >
                                {(item: { key: string; label: string }) => <SelectItem key={item.key}>{item.label}</SelectItem>}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        ),
        [search, filters, setSearch, setFilters, t]
    );

    return (
        <>
            <PageHeader
                title={t('pages.productsList')}
                breadcrumbs={[{ label: t('menu.products') }]}
                actions={
                    <div className="flex gap-2">
                        <Button
                            color="primary"
                            startContent={<PlusIcon className="h-4 w-4" />}
                            onPress={() => console.log('Add product')}
                        >
                            {t('menu.products.product.add')}
                        </Button>
                    </div>
                }
            />

            <Table
                items={products}
                columns={columns}
                getRowKey={(item) => item.id}
                isLoading={isLoading}
                actions={actions}
                topContent={topContent}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    onPageSizeChange: (size) => {
                        setPageSize(size);
                        setPage(1);
                    },
                }}
                showRefresh
                onRefresh={refresh}
            />
        </>
    );
}
