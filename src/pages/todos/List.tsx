import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Chip } from '@heroui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { Table, TableColumn, useTableData, FetchParams, PagedResult } from '@/components/common';
import { Todo } from '@/types';

interface TodosApiResponse {
    todos: Todo[];
    total: number;
    skip: number;
    limit: number;
}

// Custom fetch function
const fetchTodos = async (params: FetchParams): Promise<PagedResult<Todo>> => {
    const skip = (params.page - 1) * params.pageSize;
    const res = await fetch(`https://dummyjson.com/todos?limit=${params.pageSize}&skip=${skip}`);
    const data: TodosApiResponse = await res.json();

    return {
        items: data.todos,
        paging: {
            pageIndex: params.page,
            pageSize: params.pageSize,
            totalItems: data.total,
            totalPages: Math.ceil(data.total / params.pageSize),
        },
    };
};

export function TodosList() {
    const { t } = useTranslation();

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
