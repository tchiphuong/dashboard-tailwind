import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Chip } from '@heroui/compat';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { Table, TableColumn, useTableData, FetchParams, PagedResult } from '@/components/common';
import { TodoService } from '@/services/todo.service';
import type { Todo } from '@/types';

// Fetch function using TodoService
const fetchTodos = async (params: FetchParams): Promise<PagedResult<Todo>> => {
    const res = await TodoService.list({
        pageIndex: params.page,
        pageSize: params.pageSize,
    });

    return (
        res.data || {
            items: [],
            paging: {
                pageIndex: params.page,
                pageSize: params.pageSize,
                totalItems: 0,
                totalPages: 0,
            },
        }
    );
};

export function TodosList() {
    const t = useTranslations();

    const {
        items: todos,
        isLoading: loading,
        total,
        page,
        pageSize,
        setPage,
        refresh,
    } = useTableData<Todo>({
        fetchFn: fetchTodos,
        initialPageSize: 10,
    });

    // Define columns
    const columns: TableColumn<Todo>[] = useMemo(
        () => [
            {
                key: 'id',
                label: 'ID',
                width: 60,
                render: (todo) => <span>#{todo.id}</span>,
            },
            {
                key: 'todo',
                label: 'TASK',
                render: (todo) => (
                    <span
                        className={
                            todo.completed
                                ? 'text-gray-400 line-through'
                                : 'text-gray-800 dark:text-gray-200'
                        }
                    >
                        {todo.todo}
                    </span>
                ),
            },
            {
                key: 'completed',
                label: 'STATUS',
                width: 100,
                filterable: true,
                filterType: 'select',
                filterOptions: [
                    { key: 'true', label: 'Done' },
                    { key: 'false', label: 'Pending' },
                ],
                render: (todo) => (
                    <Chip
                        size="sm"
                        color={todo.completed ? 'success' : 'warning'}
                        variant="flat"
                        startContent={
                            todo.completed ? (
                                <CheckCircleIcon className="h-4 w-4" />
                            ) : (
                                <XCircleIcon className="h-4 w-4" />
                            )
                        }
                    >
                        {todo.completed ? t('widgets.done') : t('widgets.pending')}
                    </Chip>
                ),
            },
            {
                key: 'userId',
                label: 'USER ID',
                width: 100,
                render: (todo) => <span>User #{todo.userId}</span>,
            },
        ],
        [t]
    );

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.todos') }]} />

            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.todos')}
                </h1>
            </div>

            <Table
                items={todos}
                columns={columns}
                getRowKey={(todo) => todo.id}
                isLoading={loading}
                emptyContent="No todos found"
                showRefresh
                onRefresh={refresh}
                pagination={{
                    page,
                    pageSize,
                    total,
                    onPageChange: setPage,
                }}
            />
        </>
    );
}
