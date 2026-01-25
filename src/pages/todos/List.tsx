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
    Chip,
    Pagination,
} from '@heroui/react';
import { ArrowPathIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Breadcrumb } from '@/components/layout';
import { Todo } from '@/types';

interface TodosResponse {
    todos: Todo[];
    total: number;
    skip: number;
    limit: number;
}

export function TodosList() {
    const { t } = useTranslation();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const loadTodos = useCallback(async () => {
        setLoading(true);
        try {
            const skip = (page - 1) * limit;
            const res = await fetch(`https://dummyjson.com/todos?limit=${limit}&skip=${skip}`);
            const data: TodosResponse = await res.json();
            setTodos(data.todos);
            setTotal(data.total);
        } catch (error) {
            console.error('Error loading todos:', error);
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        loadTodos();
    }, [loadTodos]);

    const totalPages = Math.ceil(total / limit);

    return (
        <>
            <Breadcrumb items={[{ label: t('menu.todos') }]} />

            <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {t('pages.todos')}
                </h1>
                <Button
                    variant="bordered"
                    onPress={loadTodos}
                    isLoading={loading}
                    className="font-medium"
                    radius="full"
                    startContent={!loading && <ArrowPathIcon className="w-4 h-4" />}
                >
                    {t('common.refresh')}
                </Button>
            </div>

            <Table
                aria-label="Todos table"
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
                    <TableColumn>TASK</TableColumn>
                    <TableColumn width={100}>STATUS</TableColumn>
                    <TableColumn width={100}>USER ID</TableColumn>
                </TableHeader>
                <TableBody
                    items={todos}
                    isLoading={loading}
                    loadingContent={<ArrowPathIcon className="w-8 h-8 animate-spin text-blue-600" />}
                    emptyContent={t('common.search')}
                >
                    {(todo) => (
                        <TableRow key={todo.id}>
                            <TableCell>#{todo.id}</TableCell>
                            <TableCell>
                                <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}>
                                    {todo.todo}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    size="sm"
                                    color={todo.completed ? 'success' : 'warning'}
                                    variant="flat"
                                    startContent={todo.completed ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                >
                                    {todo.completed ? t('widgets.done') : t('widgets.pending')}
                                </Chip>
                            </TableCell>
                            <TableCell>User #{todo.userId}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
