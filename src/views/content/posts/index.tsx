'use client';

import { useState, useEffect, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { Breadcrumb } from '@/components/layout';
import { Card, Button, Table, Chip, Input, Modal, Select, SelectItem } from '@/components/common';
import { Skeleton } from '@heroui/react';
import {
    NewspaperIcon,
    PlusIcon,
    EyeIcon,
    TrashIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { PostService, type PostItem } from '@/services/post.service';

export function PostsList() {
    const [posts, setPosts] = useState<PostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('Tin doanh nghiệp');
    const [newContent, setNewContent] = useState('');

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await PostService.list({
                search: searchTerm || undefined,
                status: selectedStatus === 'all' ? undefined : selectedStatus,
                pageSize: 15,
            });
            if (res.data?.items) {
                setPosts(res.data.items);
            }
        } catch {
            // Error handling handled by apiClient interceptor
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, selectedStatus]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchPosts]);

    const handleCreatePost = async (e: FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            const res = await PostService.create({
                title: newTitle.trim(),
                category: newCategory,
                body: newContent.trim(),
                status: 'published',
            });

            if (res.data) {
                const createdPost = res.data;
                setPosts((prev) => [createdPost, ...prev]);
            }
            setIsCreateModalOpen(false);
            setNewTitle('');
            setNewContent('');
        } catch {
            //
        }
    };

    const handleDelete = async (id: number | string) => {
        try {
            await PostService.delete(id);
            setPosts((prev) => prev.filter((p) => p.id !== id));
        } catch {
            //
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumb
                items={[{ label: 'Nội dung & Truyền thông', href: '#' }, { label: 'Bài viết' }]}
            />

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        Quản lý bài viết & Tin tức
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Soạn thảo bài viết, thông báo nội bộ và tin tức truyền thông doanh nghiệp
                        kết nối API Gateway.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        onClick={fetchPosts}
                        className="flex items-center gap-1.5"
                    >
                        <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>Làm mới</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-1.5"
                    >
                        <PlusIcon className="h-4 w-4" />
                        <span>Viết bài mới</span>
                    </Button>
                </div>
            </div>

            {/* Bộ lọc tìm kiếm */}
            <Card className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="w-full sm:w-80">
                        <Input
                            placeholder="Tìm bài viết..."
                            value={searchTerm}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setSearchTerm(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Trạng thái:
                        </span>
                        <div className="w-44">
                            <Select
                                placeholder="Chọn trạng thái"
                                selectedKey={selectedStatus}
                                onSelectionChange={(key) => {
                                    if (key) setSelectedStatus(String(key));
                                }}
                            >
                                <SelectItem id="all" textValue="Tất cả trạng thái">
                                    Tất cả trạng thái
                                </SelectItem>
                                <SelectItem id="published" textValue="Đã xuất bản">
                                    Đã xuất bản
                                </SelectItem>
                                <SelectItem id="draft" textValue="Bản nháp">
                                    Bản nháp
                                </SelectItem>
                                <SelectItem id="archived" textValue="Lưu trữ">
                                    Lưu trữ
                                </SelectItem>
                            </Select>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Bảng danh sách bài viết */}
            <Card className="overflow-hidden">
                {isLoading ? (
                    <div className="space-y-4 p-6">
                        <Skeleton className="h-8 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                        <Skeleton className="h-12 w-full rounded" />
                    </div>
                ) : (
                    <Table variant="secondary">
                        <Table.ScrollContainer>
                            <Table.Content aria-label="Bảng danh sách bài viết">
                                <Table.Header>
                                    <Table.Column isRowHeader>Tiêu đề bài viết</Table.Column>
                                    <Table.Column>Chuyên mục</Table.Column>
                                    <Table.Column>Tác giả</Table.Column>
                                    <Table.Column>Ngày đăng</Table.Column>
                                    <Table.Column>Lượt xem</Table.Column>
                                    <Table.Column>Trạng thái</Table.Column>
                                    <Table.Column className="text-right">Thao tác</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {posts.map((post) => (
                                        <Table.Row
                                            key={String(post.id)}
                                            className="hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <Table.Cell>
                                                <div className="flex max-w-md items-start gap-2.5">
                                                    <NewspaperIcon className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                                                    <div>
                                                        <p className="line-clamp-1 text-xs font-bold text-gray-900 dark:text-white">
                                                            {post.title}
                                                        </p>
                                                        <p className="font-mono text-[10px] text-gray-400">
                                                            /{post.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
                                                    {post.category}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="text-xs text-gray-700 dark:text-gray-300">
                                                    {post.author}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <span className="font-mono text-xs text-gray-500">
                                                    {post.publishDate}
                                                </span>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex items-center gap-1 font-mono text-xs text-gray-600 dark:text-gray-400">
                                                    <EyeIcon className="h-3.5 w-3.5" />
                                                    <span>
                                                        {post.views.toLocaleString('vi-VN')}
                                                    </span>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {post.status === 'published' && (
                                                    <Chip color="success" variant="soft" size="sm">
                                                        Đã xuất bản
                                                    </Chip>
                                                )}
                                                {post.status === 'draft' && (
                                                    <Chip color="warning" variant="soft" size="sm">
                                                        Bản nháp
                                                    </Chip>
                                                )}
                                                {post.status === 'archived' && (
                                                    <Chip color="danger" variant="soft" size="sm">
                                                        Lưu trữ
                                                    </Chip>
                                                )}
                                            </Table.Cell>
                                            <Table.Cell className="text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(post.id)}
                                                        className="rounded p-1 text-gray-400 transition-colors hover:text-rose-600"
                                                        title="Xóa bài viết"
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                )}
            </Card>

            {/* Modal Viết Bài Mới */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Soạn thảo bài viết mới"
                size="lg"
            >
                <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Tiêu đề bài viết:
                        </label>
                        <Input
                            placeholder="Nhập tiêu đề hấp dẫn cho bài viết..."
                            value={newTitle}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setNewTitle(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Chuyên mục bài viết:
                        </label>
                        <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-xs font-medium text-gray-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300"
                        >
                            <option value="Tin doanh nghiệp">Tin doanh nghiệp</option>
                            <option value="Công nghệ & Sản phẩm">Công nghệ & Sản phẩm</option>
                            <option value="Văn hóa nội bộ">Văn hóa nội bộ</option>
                            <option value="Chiến lược phát triển">Chiến lược phát triển</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                            Nội dung chi tiết:
                        </label>
                        <textarea
                            rows={6}
                            placeholder="Nhập nội dung bài viết..."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white p-3 text-xs text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-200"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                        >
                            Đóng
                        </Button>
                        <Button variant="primary" type="submit">
                            Xuất bản bài viết
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
