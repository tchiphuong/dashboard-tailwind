import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Chip } from '@heroui/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { Table, TableColumn, useTableData, FetchParams, PagedResult } from '@/components/common';

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

interface PostsApiResponse {
    posts: Post[];
    total: number;
    skip: number;
    limit: number;
}

// Custom fetch function for DummyJSON API
const fetchPosts = async (params: FetchParams): Promise<PagedResult<Post>> => {
    const skip = (params.page - 1) * params.pageSize;
    const url = params.search
        ? `https://dummyjson.com/posts/search?q=${params.search}&limit=${params.pageSize}&skip=${skip}`
        : `https://dummyjson.com/posts?limit=${params.pageSize}&skip=${skip}`;

    const res = await fetch(url);
    const data: PostsApiResponse = await res.json();

    return {
        items: data.posts,
        paging: {
            pageIndex: params.page,
            pageSize: params.pageSize,
            totalItems: data.total,
            totalPages: Math.ceil(data.total / params.pageSize),
        },
    };
};

export function PostsList() {
    const { t } = useTranslation();

    const {
        items: posts,
        isLoading: loading,
        total,
        page,
        pageSize,
        search,
        setPage,
        setPageSize,
        setSearch,
        refresh,
    } = useTableData<Post>({
        fetchFn: fetchPosts,
        initialPageSize: 10,
    });

    // Define columns
    const columns: TableColumn<Post>[] = useMemo(
        () => [
            {
                key: 'id',
                label: 'ID',
                width: 60,
                render: (post) => (
                    <span className="text-gray-500 dark:text-gray-400">#{post.id}</span>
                ),
            },
            {
                key: 'title',
                label: 'TITLE',
                sortable: true,
                render: (post) => (
                    <p className="line-clamp-1 max-w-[200px] font-medium text-gray-800 dark:text-gray-200">
                        {post.title}
                    </p>
                ),
            },
            {
                key: 'body',
                label: 'CONTENT',
                render: (post) => (
                    <p className="line-clamp-2 max-w-[250px] text-sm text-gray-600 dark:text-gray-400">
                        {post.body}
                    </p>
                ),
            },
            {
                key: 'tags',
                label: 'TAGS',
                width: 150,
                render: (post) => (
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
                ),
            },
            {
                key: 'reactions',
                label: 'REACTIONS',
                width: 100,
                render: (post) => (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-600">👍 {post.reactions.likes}</span>
                        <span className="text-red-500">👎 {post.reactions.dislikes}</span>
                    </div>
                ),
            },
            {
                key: 'views',
                label: 'VIEWS',
                width: 80,
                sortable: true,
                render: (post) => (
                    <span className="text-sm text-gray-600 dark:text-gray-300">{post.views}</span>
                ),
            },
        ],
        []
    );

    // Define actions
    const actions = useMemo(
        () => [
            { key: 'view', label: 'View', onClick: () => {} },
            { key: 'edit', label: 'Edit', onClick: () => {} },
            { key: 'delete', label: 'Delete', onClick: () => {} },
        ],
        []
    );

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.posts') }]} />

            {/* Header */}
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.postsList')}
                </h1>
                <Button color="primary" startContent={<PlusIcon className="h-4 w-4" />}>
                    New Post
                </Button>
            </div>

            {/* Table */}
            <Table
                items={posts}
                columns={columns}
                getRowKey={(post) => post.id}
                actions={actions}
                isLoading={loading}
                emptyContent="No posts found"
                showSearch
                searchPlaceholder={t('common.search') + '...'}
                searchValue={search}
                onSearchChange={setSearch}
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                    pageSizeOptions: [5, 10, 20, 50],
                    onPageSizeChange: setPageSize,
                }}
                toolbarContent={
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        Total: <strong>{total}</strong> posts
                    </span>
                }
            />
        </>
    );
}
