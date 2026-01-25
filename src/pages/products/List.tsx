import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Chip,
    Pagination,
    Select,
    SelectItem,
} from '@heroui/react';
import { MagnifyingGlassIcon, ArrowPathIcon, PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';

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
            <Breadcrumb items={[{ label: t('menu.products') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.productsList')}
                </h1>
                <div className="flex gap-2">
                    <Button
                        color="primary"
                        className="font-medium"
                        radius="full"
                        startContent={<PlusIcon className="w-4 h-4" />}
                    >
                        Add Product
                    </Button>
                    <Button
                        variant="bordered"
                        onPress={loadProducts}
                        isLoading={loading}
                        className="font-medium"
                        radius="full"
                        startContent={!loading && <ArrowPathIcon className="w-4 h-4" />}
                    >
                        {t('common.refresh')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder={t('common.search') + '...'}
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                    value={search}
                    onClear={() => handleSearchChange('')}
                    onValueChange={handleSearchChange}
                    variant="bordered"
                    radius="full"
                    classNames={{
                        inputWrapper: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-1",
                    }}
                />
                <Select
                    className="w-full sm:max-w-xs"
                    placeholder="Select category"
                    selectedKeys={category ? [category] : []}
                    onSelectionChange={(keys) => handleCategoryChange(keys as Set<string>)}
                    variant="bordered"
                    radius="full"
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-1",
                    }}
                >
                    {categories.map((cat) => (
                        <SelectItem key={cat.key}>{cat.label}</SelectItem>
                    ))}
                </Select>
                <Select
                    className="w-full sm:max-w-[140px]"
                    selectedKeys={[String(rowsPerPage)]}
                    onSelectionChange={(keys) => handleRowsPerPageChange(keys as Set<string>)}
                    variant="bordered"
                    radius="full"
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-1",
                    }}
                >
                    {rowsPerPageOptions.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
                <div className="flex-1 text-right text-sm text-gray-500 dark:text-gray-400 self-center hidden sm:block">
                    Total: <span className="font-semibold text-gray-800 dark:text-gray-200">{total}</span> products
                </div>
            </div>

            {/* Table */}
            <Table
                aria-label="Products table"
                isStriped
                classNames={{
                    wrapper: 'rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                    th: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-semibold',
                    td: 'data-[striped=true]:bg-gray-50/50 dark:data-[striped=true]:bg-gray-800/50',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex justify-between items-center px-4 py-4 border-t border-gray-100 dark:border-gray-700">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Showing {(page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, total)} of {total}
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
                    <TableColumn width={60}>ID</TableColumn>
                    <TableColumn>PRODUCT</TableColumn>
                    <TableColumn width={120}>CATEGORY</TableColumn>
                    <TableColumn width={100}>BRAND</TableColumn>
                    <TableColumn width={100}>PRICE</TableColumn>
                    <TableColumn width={80}>STOCK</TableColumn>
                    <TableColumn width={80}>RATING</TableColumn>
                    <TableColumn width={120} align="center">ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    items={products}
                    isLoading={loading}
                    loadingContent={<ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />}
                    emptyContent="No products found"
                >
                    {(product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <span className="text-gray-500 dark:text-gray-400">#{product.id}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden border border-gray-200 dark:border-gray-600">
                                        <img
                                            src={product.thumbnail}
                                            alt={product.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                            {product.brand}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat" color="primary" className="capitalize">
                                    {product.category}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <span className="text-gray-600 dark:text-gray-300 text-sm">{product.brand || '-'}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-green-600 dark:text-green-400">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.discountPercentage > 10 && (
                                        <span className="text-xs text-red-500">-{Math.round(product.discountPercentage)}%</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip size="sm" variant="dot" color={getStockColor(product.stock)}>
                                    {product.stock}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full w-fit">
                                    <span className="text-yellow-500 text-xs">★</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.rating.toFixed(1)}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-center gap-1">
                                    <Button isIconOnly size="sm" variant="light" aria-label="View" radius="full">
                                        <EyeIcon className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" aria-label="Edit" radius="full">
                                        <PencilIcon className="w-4 h-4 text-blue-500" />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Delete" radius="full">
                                        <TrashIcon className="w-4 h-4 text-red-500" />
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
