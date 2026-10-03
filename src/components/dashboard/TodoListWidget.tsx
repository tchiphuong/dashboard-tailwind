'use client';

import type { Todo } from '@/types';
import { CheckCircleIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { Card, Chip } from '@/components/common';

interface TodoListWidgetProps {
    todos: Todo[];
}

export function TodoListWidget({ todos }: Readonly<TodoListWidgetProps>) {
    const t = useTranslations();

    return (
        <Card className="relative overflow-hidden border border-b-4 border-orange-500 bg-white/95 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-md dark:border-orange-500 dark:bg-zinc-900/90">
            <Card.Header
                icon={<ClipboardDocumentListIcon className="size-4" />}
                iconColor="warning"
                title={t('widgets.pendingTasks')}
                action={
                    <span className="text-[0.6875rem] text-zinc-400 tabular-nums">
                        {todos.length} nhiệm vụ
                    </span>
                }
            />

            <div className="space-y-2">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-2.5 transition-all hover:bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70"
                    >
                        <div className="flex min-w-0 items-center gap-2.5 pr-2">
                            <span
                                className={`size-2 shrink-0 rounded-full ${
                                    todo.completed ? 'bg-emerald-500' : 'animate-pulse bg-amber-500'
                                }`}
                            />
                            <span
                                className={`truncate text-xs ${
                                    todo.completed
                                        ? 'text-zinc-400 line-through dark:text-zinc-500'
                                        : 'font-medium text-zinc-800 dark:text-zinc-200'
                                }`}
                            >
                                {todo.todo}
                            </span>
                        </div>
                        {todo.completed ? (
                            <CheckCircleIcon className="size-4 shrink-0 text-emerald-500" />
                        ) : (
                            <Chip
                                size="sm"
                                color="warning"
                                variant="soft"
                                className="h-5 text-[10px] font-semibold"
                            >
                                {t('widgets.pending')}
                            </Chip>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
}
