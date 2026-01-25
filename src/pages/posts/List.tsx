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

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
    tags: string[];
    reactions: {
        likes: number;
        dislikes: number;
    };
    views: number;
}

interface PostsResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}

const rowsPerPageOptions = [
    { key: '5', label: '5 rows' },
    { key: '10', label: '10 rows' },
    { key: '20', label: '20 rows' },
    { key: '50', label: '50 rows' },
];

export function PostsList() {
    const { t } = useTranslation();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const loadPosts = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * rowsPerPage;
            const url = search
                ? `https://dummyjson.com/posts/search?q=${search}&limit=${rowsPerPage}&skip=${skip}`
                : `https://dummyjson.com/posts?limit=${rowsPerPage}&skip=${skip}`;

            const res = await fetch(url);
            const data: PostsResponse = await res.json();
            setPosts(data.posts);
            setTotal(data.total);
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, search]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleRowsPerPageChange = (keys: Set<string> | string) => {
        const value = typeof keys === 'string' ? keys : Array.from(keys)[0] || '10';
        setRowsPerPage(Number(value));
        setPage(1);
    };

    const totalPages = Math.ceil(total / rowsPerPage);

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.posts') }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.postsList')}
                </h1>
                <div className="flex gap-2">
                    <Button color="primary" startContent={<PlusIcon className="w-4 h-4" />}>
                        New Post
                    </Button>
                    <Button
                        variant="bordered"
                        startContent={<ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                        onPress={loadPosts}
                        isLoading={loading}
                    >
                        {t('common.refresh')}
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input
                    isClearable
                    className="w-full sm:max-w-xs"
                    placeholder={t('common.search') + '...'}
                    startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                    value={search}
                    onClear={() => handleSearchChange('')}
                    onValueChange={handleSearchChange}
                    variant="bordered"
                />
                <Select
                    className="w-full sm:max-w-[140px]"
                    selectedKeys={[String(rowsPerPage)]}
                    onSelectionChange={(keys) => handleRowsPerPageChange(keys as Set<string>)}
                    variant="bordered"
                >
                    {rowsPerPageOptions.map((opt) => (
                        <SelectItem key={opt.key}>{opt.label}</SelectItem>
                    ))}
                </Select>
                <div className="flex-1 text-right text-sm text-gray-500 dark:text-gray-400 self-center">
                    Total: <strong>{total}</strong> posts
                </div>
            </div>

            {/* Table */}
            <Table
                aria-label="Posts table"
                isStriped
                classNames={{
                    wrapper: 'rounded-xl shadow-lg border border-gray-200 dark:border-gray-700',
                    th: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex justify-between items-center px-2 py-2">
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
                            />
                        </div>
                    )
                }
                bottomContentPlacement="outside"
            >
                <TableHeader>
                    <TableColumn width={60}>ID</TableColumn>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn>CONTENT</TableColumn>
                    <TableColumn width={150}>TAGS</TableColumn>
                    <TableColumn width={100}>REACTIONS</TableColumn>
                    <TableColumn width={80}>VIEWS</TableColumn>
                    <TableColumn width={120}>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody
                    items={posts}
                    isLoading={loading}
                    loadingContent={<ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />}
                    emptyContent="No posts found"
                >
                    {(post) => (
                        <TableRow key={post.id}>
                            <TableCell>
                                <span className="text-gray-500 dark:text-gray-400">#{post.id}</span>
                            </TableCell>
                            <TableCell>
                                <p className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[200px]">
                                    {post.title}
                                </p>
                            </TableCell>
                            <TableCell>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-[250px]">
                                    {post.body}
                                </p>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {post.tags.slice(0, 2).map((tag, i) => (
                                        <Chip key={i} size="sm" variant="flat" color="secondary">
                                            {tag}
                                        </Chip>
                                    ))}
                                    {post.tags.length > 2 && (
                                        <span className="text-xs text-gray-500">+{post.tags.length - 2}</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-green-600">👍 {post.reactions.likes}</span>
                                    <span className="text-red-500">👎 {post.reactions.dislikes}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{post.views}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Button isIconOnly size="sm" variant="light" aria-label="View">
                                        <EyeIcon className="w-4 h-4 text-gray-500" />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" aria-label="Edit">
                                        <PencilIcon className="w-4 h-4 text-blue-500" />
                                    </Button>
                                    <Button isIconOnly size="sm" variant="light" color="danger" aria-label="Delete">
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
