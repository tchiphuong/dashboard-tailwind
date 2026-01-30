import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Pagination,
    SelectItem,
} from '@heroui/react';
import { PageHeader, Button, Input, Select } from '@/components/common';
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    PlusIcon,
} from '@heroicons/react/24/outline';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
}

interface ProductsResponse {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
}

const categories = [
    { key: '', label: 'All Categories' },
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

const rowsPerPageOptions = [
    { key: '5', label: '5 rows' },
    { key: '10', label: '10 rows' },
    { key: '20', label: '20 rows' },
    { key: '50', label: '50 rows' },
];

export function ProductsPage() {
    const { t } = useTranslation();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * rowsPerPage;
            let url = '';

            if (category) {
                url = `https://dummyjson.com/products/category/${category}?limit=${rowsPerPage}&skip=${skip}`;
            } else if (search) {
                url = `https://dummyjson.com/products/search?q=${search}&limit=${rowsPerPage}&skip=${skip}`;
            } else {
                url = `https://dummyjson.com/products?limit=${rowsPerPage}&skip=${skip}`;
            }

            const res = await fetch(url);
            const data: ProductsResponse = await res.json();
            setProducts(data.products);
            setTotal(data.total);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search, category]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCategory('');
        setPage(1);
    };

    const handleCategoryChange = (keys: Set<string> | string) => {
        const value = typeof keys === 'string' ? keys : Array.from(keys)[0] || '';
        setCategory(value);
        setSearch('');
        setPage(1);
    };

    const handleRowsPerPageChange = (keys: Set<string> | string) => {
        const value = typeof keys === 'string' ? keys : Array.from(keys)[0] || '10';
        setRowsPerPage(Number(value));
        setPage(1);
    };

    const totalPages = Math.ceil(total / rowsPerPage);

    const getStockColor = (stock: number): 'success' | 'warning' | 'danger' => {
        if (stock > 50) return 'success';
        if (stock > 10) return 'warning';
        return 'danger';
    };

    return (
        <>
            <PageHeader
                title={t('pages.productsList')}
                breadcrumbs={[{ label: t('menu.products') }]}
                actions={
                    <>
                        <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                            {t('menu.products.product.add')}
                        </Button>
                        <Button
                            variant="bordered"
                            onPress={loadProducts}
                            isLoading={loading}
                            startContent={!loading && <ArrowPathIcon className="h-4 w-4" />}
                        >
                            {t('common.refresh')}
                        </Button>
                    </>
                }
            />

            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row dark:border-zinc-700 dark:bg-zinc-800">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder={t('common.search') + '...'}
                    startContent={<MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />}
                    value={search}
                    onClear={() => handleSearchChange('')}
                    onValueChange={handleSearchChange}
                />
                <Select
                    className="w-full sm:max-w-xs"
                    placeholder={t('menu.product.selectCategory')}
                    selectedKeys={category ? [category] : []}
                    onSelectionChange={(keys) => handleCategoryChange(keys as Set<string>)}
                >
                    {categories.map((cat) => (
                        <SelectItem key={cat.key}>{cat.label}</SelectItem>
                    ))}
                </Select>
                <Select
                    className="w-full sm:max-w-35"
                    selectedKeys={[String(rowsPerPage)]}
                    onSelectionChange={(keys) => handleRowsPerPageChange(keys as Set<string>)}
                >
                    {rowsPerPageOptions.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
                <div className="hidden flex-1 self-center text-right text-sm text-gray-500 sm:block dark:text-gray-400">
                    {t('common.total')}:{' '}
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span>{' '}
                    {t('menu.products').toLowerCase()}
                </div>
            </div>

            {/* Table */}
            <Table
                aria-label={t('menu.product.title')}
                isStriped
                classNames={{
                    wrapper:
                        'rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800',
                    th: 'bg-gray-50 dark:bg-zinc-700/50 text-gray-600 dark:text-gray-300 font-semibold',
                    td: 'data-[striped=true]:bg-gray-50/50 dark:data-[striped=true]:bg-gray-800/50',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex items-center justify-between border-t border-zinc-100 px-4 py-4 dark:border-zinc-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {t('common.showing', {
                                    from: (page - 1) * rowsPerPage + 1,
                                    to: Math.min(page * rowsPerPage, total),
                                    total,
                                })}
                            </span>
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                className="gap-2"
                                radius="md"
                            />
                        </div>
                    )
                }
                bottomContentPlacement="outside"
            >
                <TableHeader>
                    <TableColumn width={60}>{t('common.id')}</TableColumn>
                    <TableColumn>{t('menu.product.fields.product').toUpperCase()}</TableColumn>
                    <TableColumn>{t('menu.product.fields.category').toUpperCase()}</TableColumn>
                    <TableColumn>{t('menu.product.fields.brand').toUpperCase()}</TableColumn>
                    <TableColumn>{t('menu.product.fields.price').toUpperCase()}</TableColumn>
                    <TableColumn>{t('menu.product.fields.stock').toUpperCase()}</TableColumn>
                    <TableColumn>{t('menu.product.fields.rating').toUpperCase()}</TableColumn>
                    <TableColumn align="center">{t('common.actions').toUpperCase()}</TableColumn>
                </TableHeader>
                <TableBody
                    items={products}
                    isLoading={loading}
                    loadingContent={
                        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                    }
                    emptyContent="No products found"
                >
                    {(product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <span className="text-gray-500 dark:text-gray-400">
                                    #{product.id}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-gray-100 dark:border-zinc-600 dark:bg-zinc-700">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="max-w-50 truncate font-medium text-gray-800 dark:text-gray-200">
                                            {product.title}
                                        </p>
                                        <p className="max-w-50 truncate text-xs text-gray-500 dark:text-gray-400">
                                            {product.brand}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color="primary"
                                    className="capitalize"
                                >
                                    {product.category}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                    {product.brand || '-'}
                                </span>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.discountPercentage > 10 && (
                                        <span className="text-xs text-red-500">
                                            -{Math.round(product.discountPercentage)}%
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="dot" color={getStockColor(product.stock)}>
                                    {product.stock}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex w-fit items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 dark:bg-yellow-900/20">
                                    <span className="text-xs text-yellow-500">★</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {product.rating.toFixed(1)}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        aria-label="View"
                                        radius="full"
                                    >
                                        <EyeIcon className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        aria-label="Edit"
                                        radius="full"
                                    >
                                        <PencilIcon className="h-4 w-4 text-blue-500" />
                                    </Button>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        color="danger"
                                        aria-label="Delete"
                                        radius="full"
                                    >
                                        <TrashIcon className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
