import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    User,
    Pagination,
} from '@heroui/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { Comment } from '@/types';

interface CommentsResponse {
    comments: Comment[];
    total: number;
    skip: number;
    limit: number;
}

export function CommentsList() {
    const { t } = useTranslation();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const loadComments = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            const res = await fetch(`https://dummyjson.com/comments?limit=${limit}&skip=${skip}`);
            const data: CommentsResponse = await res.json();
            setComments(data.comments);
            setTotal(data.total);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        loadComments();
    }, [loadComments]);

    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.comments') }]} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.comments')}
                </h1>
                <Button
                    variant="bordered"
                    onPress={loadComments}
                    isLoading={loading}
                    className="font-medium"
                    radius="full"
                    startContent={!loading && <ArrowPathIcon className="w-4 h-4" />}
                >
                    {t('common.refresh')}
                </Button>
            </div>

            <Table
                aria-label="Comments table"
                classNames={{
                    wrapper: 'rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                    th: 'bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 font-semibold',
                }}
                bottomContent={
                    totalPages > 0 && (
                        <div className="flex justify-center p-4">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={page}
                                total={totalPages}
                                onChange={setPage}
                                radius="full"
                            />
                        </div>
                    )
                }
            >
                <TableHeader>
                    <TableColumn width={60}>ID</TableColumn>
                    <TableColumn width={200}>USER</TableColumn>
                    <TableColumn>COMMENT</TableColumn>
                    <TableColumn width={100}>POST ID</TableColumn>
                </TableHeader>
                <TableBody
                    items={comments}
                    isLoading={loading}
                    loadingContent={<ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />}
                    emptyContent="No comments found"
                >
                    {(comment) => (
                        <TableRow key={comment.id}>
                            <TableCell>#{comment.id}</TableCell>
                            <TableCell>
                                <User
                                    name={comment.user.username}
                                    description={comment.user.fullName}
                                    avatarProps={{
                                        src: `https://i.pravatar.cc/150?u=${comment.user.id}`,
                                        radius: "full"
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
                                    {comment.body}
                                </p>
                            </TableCell>
                            <TableCell>Post #{comment.postId}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
